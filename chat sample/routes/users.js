const { response } = require('express');
var express = require('express');

var router = express.Router();
const userController = require('../controller/user_controller')

/* GET users listing. */
router.get('/', function (req, res) {
  res.io.emit("socketToMe", "users");
  let user=req.session.user
  let ifSession = req.user;
  if(ifSession){
    res.render('users/index',{user})
  }else{
    res.render('users/login')
  }
  
});
router.get('/index',(req,res)=>{
  let user=req.session.user
  console.log('req.session.user',user);
  let ifSession = user;
  console.log('ifSession',ifSession);
  if(ifSession){
   userController.getAllUsers().then((users)=>{
     console.log('usegfiueguifg',users);
    res.render('users/index',{user:true,users})
   })
    
  }else{
    res.redirect('/')
  }
  
})
router.get('/user_login', (req, res) => {
  let ifSession = req.session.user;
  if(ifSession){
    res.redirect('/')
  }else{
  res.render('users/login')
  }
})
router.get('/user_register', (req, res) => {
  res.render('users/register')
})
router.post('/user_register', (req, res) => {
  console.log('user data in post register:', req.body);
  userController.userIdExists(req.body.username).then((data) => {
    console.log(data);
    res.json({ userRegistered: false })
  }).catch(() => {
    userController.userRegister(req.body).then((data) => {
      res.json({ userRegistered: true })
    }).catch((err) => {
      console.log('user_register error:', err)
    })
  })

})
router.post('/user_login',(req,res)=>{
  
    userController.userLogin(req.body).then((response)=>{
      console.log('response in post login',response)
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.json({ user_login: true});
    }).catch((response)=>{
      console.log('response catch',response)
      if(response.invalidUser=true){
        res.json({ invalidUser: true });
      }
    })
  
  
 
})
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/user_login");
});

module.exports = router;
