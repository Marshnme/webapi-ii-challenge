const router = require("express").Router();
const  db = require("./data/db");



//MVP --------------------------
//GET req

router.get("/", (req,res) => {
    db.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        console.log("error", err)
        res.status(500).json({error:"The posts information could not be retrieved."})
    })
})

//MVP --------------------------
//GET by ID
router.get("/:id", (req,res) => {
    const id = req.params.id;

// if(find){
//                 res.status(200).json(find)
//             }
    
        db.findById(id)
        .then(post => {
            const postId = post.map(item => item.id)
            console.log(postId)
            console.log(id)
            console.log(post)
            if(postId == id){
                res.status(200).json(post)
            }else{
                res.status(404).json({error:"The post with the specified ID does not exist."})
                
            }
            
        })
        .catch(err => {
            console.log("error", err)
            res.status(500).json({error:"The post information could not be retrieved."})
        })
        
    
})

router.get("/:id/comments", (req,res) => {
    const id = req.params.id;
    console.log("request--",req.posts)

    // let postId = db.findById(id)
    
        db.findPostComments(id)
    .then(posts => {
        console.log("posts",posts)
        const postsId = posts.find(item=>item.post_id);
        console.log("postId",postsId.post_id)
        console.log("id",id)
        if(postsId.post_id == id){
            res.status(200).json(posts)
        }else{
            res.status(404).json({error:"The user with the specified ID does not exist."})
        }
        
        
    })
    .catch(err => {
        console.log("error", err)
        res.status(500).json({error:"The comments information could not be retrieved."})
    })
})


//MVP-------------------------------
//POST req

router.post("", (req,res) => {
    const {title, contents} = req.body;
    (!title || !contents)
    ? res
        .status(400).json({error:"Please provide title and contents for the post."})


    :db.insert(req.body)
    .then(user => {
        res.status(201).json(user)
    } )
    .catch(err => {
        console.log("error", err)
        res.status(500).json({error:"There was an error while saving the post to the database"})
    })
})



router.post("/:id/comments",(req,res) => {
    const {text,post_id} = req.body
    const idTrue = req.params.id;


    if(idTrue !== post_id){
        res
        .status(400).json({error:"The post with the specified ID does not exist."})
    }
    if(!text){
        res
        .status(400).json({error:"Please provide text for the comment."})
    }

    db.insertComment(req.body)
    .then(id => {
        
        res.status(201).json(id);
    })
    .catch(err => {
        console.log("error", err)
        res.status(500).json({error:"There was an error while saving the comment to the database"})
    })
})

//MVP ----------------
//PUT req

router.put("/:id", (req,res) => {
    const {title,contents} = req.body;
    const oldUser = req.params.id;

    (!title || !contents)

    ?res 
    .status(400).json({error:"Please provide title and contents for the post."})

//find by ID include in res-----------------------------------
    :db.update(oldUser,req.body)
    .then( count => {
        db.findById(req.params.id)
        .then(user =>{
            if(!count){
            res.status(404).json({error:"The post with the specified ID does not exist."})
        }
        res.status(200).json(user)
    })
    .catch(err => {
        console.log("error", err)
        res.status(500).json({error:"The post information could not be modified."})
    })
        })
        
})

//MVP-----------------------------------------
//DELETE req 

router.delete("/:id", (req,res) => {
    const user = req.params.id;

    db.remove(user)
    .then(gone => {
        if(!gone){
            res.status(404).json({error:"The post with the specified ID does not exist."})
        }
        res.status(200).json(gone)
    })
    .catch(err => {
        console.log("error", err)
        res.status(500).json({error:"The post could not be removed"})
    })
})


module.exports= router