// Requiring path to so we can use relative routes to our HTML files
const path = require("path");
const db = require("../models");
const Sequelize = require('sequelize');
// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");
module.exports = function(app) {
  app.get("/", async (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/game");
    } 
    try {
    const [results, metadata] = await db.sequelize.query(`
    select 
      u.userName userName, 
      sum(c.totalCorrect) totalCorrect, 
      sum(c.totalAnswered) totalAnswered, 
      concat(format((sum(c.totalCorrect)/sum(c.totalAnswered))*100,2),'%') overallPercentCorrect
    from Users u 
    join Categories c on (u.id = c.userId)
    group by u.userName
    order by overallPercentCorrect desc 
    limit 10`);
    res.render('index', {highScores: results});
    }catch(err){res.render("index",{highScores:[]})};
  });
  app.get("/signup", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/");
    }
    res.render('signup');
  });
  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/profile", isAuthenticated, async(req, res) => {
    try {
    const [results, metadata] = await db.sequelize.query(`
        select 
        u.userName userName, 
        c.totalCorrect totalCorrect, 
        c.totalAnswered totalAnswered, 
        c.categoryName categoryName,
        concat(format((c.totalCorrect/c.totalAnswered)*100,2),'%') categoryPercentCorrect
        from Users u 
        join Categories c on (u.id = c.userId)
        where u.id = ${req.user.id}
        order by categoryPercentCorrect desc`);
        const [results2, metadata2] = await db.sequelize.query(`
        select 
        u.userName userName, 
        sum(c.totalCorrect) totalCorrect, 
        sum(c.totalAnswered) totalAnswered, 
        concat(format((sum(c.totalCorrect)/sum(c.totalAnswered))*100,2),'%') overallPercentCorrect
        from Users u 
        join Categories c on (u.id = c.userId)
        where u.id = ${req.user.id}
        group by u.userName`);
        res.render('profile', {user:req.user, scores:results, overall:results2});
        console.log(results2)
      }catch(err){res.render("profile",{user:req.user, scores:[], overall:[]})}
  });
  app.get("/game", isAuthenticated, (req, res) => {
    res.render('game',{user:req.user.id});
  });
};