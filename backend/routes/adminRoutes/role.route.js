import express from "express"
import prisma from "../../prisma/client.js";

const router = express.Router();

router.post('/add-role' , async(req , res)=>{
    const { rolename } = req.body;
    
    try {
        const isRole = await prisma.role.findUnique({
            where : {
                rolename : rolename,
            }
        })
        if(isRole){
            return res.status(500).json({message : "role already exists ..."});
        }

        await prisma.role.create({
            data : {
                rolename : rolename,
            }
        })

        return res.status(200).json({message : "Role added successfully ..."});
    } catch (error) {
        return res.status(400).json({error : error.message});
    }
})

router.delete('/delete-role' , async(req , res)=>{
    const { rolename } = req.body;

    const isRole = await prisma.role.findUnique({
        where : {
            rolename : rolename,
        }
    })

    if(!isRole){
        return res.status(404).json({message : "could not found this role..."});
    }

    const deleteRole = await prisma.role.delete({
        where : {
            rolename : rolename,
        }
    })

    return res.status(200).json({message : "role deleted successfully ..." , deleteRole})
})

export default router;