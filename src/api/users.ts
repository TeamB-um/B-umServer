import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";


import User from "../models/Users";


const router = Router();

/**
 *  @route POST api/users/enroll
 *  @desc Create a user
 *  @access Public
 */

router.post(
    "/enroll",
    [
        check("id", "id is required").not().isEmpty(),
    ],
    async ( req: Request, res : Response) => {
        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const id =req.body;
        let { ispush, delperiod} = req.body;

        try{
            let user = await User.findOne({id});
            if (user){
                res.status(200).json({
                    errors: [{msg : "이미 존재하는 사용자"}],
                });
            }
        

            user = new User({
                id,
                ispush,
                delperiod,
            });
            await user.save();

        } catch(err){
            console.error(err.message);
            res.status(500).send("서버 오류")
        }



    }
)

/**
 *  @route GET api/users
 *  @desc search all users
 *  @access Public
 */

 router.get("/", async (req: Request, res: Response) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("서버 오류");
    }
  });

/** 
  *  @route GET api/users/:id
  *  @desc Get user by ID
  *  @access Public
  */
 router.get("/:id", async (req: Request, res: Response) => {
   try {
     const user = await User.findById(req.params.id);
 
     if (!user) {
       return res.status(404).json({ msg: "특정 사용자 조회 실패" });
     }
     res.json(user);
   } catch (error) {
     console.error(error.message);
     if (error.kind === "ObjectId") {
       return res.status(404).json({ msg: "특정 사용자 조회 실패" });
     }
     res.status(500).send("서버 오류");
   }
 });  

/** 
  *  @route PATCH api/users/:id
  *  @desc PATCH user by ID
  *  @access Public
  */
// router.patch("/:id", async(req:Request, res :Response) =>{
//     try {
//         const user = await User.findById(req.params.id);

//         if(!user){
//             return res.status(404).json({msg : "특정 사용자 수정 실패"})
//         }
//         user{}=req.body
//     }




// });

module.exports = router;