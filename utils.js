import fetch from 'node-fetch';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';

export const middleware = async (req, next, url) => {
    const list = url.split(',');
    if (list.length < 2) {
        req.data = await peticion(list[0]);
    } else {
        let users = await peticion(list[0]);
        let posts = await peticion(list[1]);  
        
        let resp = [];
        
        users.forEach((user) => {
            let respUser = {}
            respUser.id = user.id;
            respUser.name = user.name;
            respUser.username = user.username;
            respUser.email = user.email;
            
            const post = posts.filter((post) =>  post.userId == user.id);  
            let respPostArray = [];
            for (let index = 0; index < post.length; index++) {
                const element = post[index];
                
                let respPost = {};
                respPost.id = element.id;
                respPost.title = element.title;
                respPost.body = element.body;
                respPostArray.push(respPost);
            }
            respUser.posts = respPostArray;
            resp.push(respUser)
        });
        req.data = resp;
    }

    next();
}

const peticion = async (url) => {
    let respuesta ;
    await fetch(url)
    .then(response => response.json())
    .then(data => {
        respuesta = data;
    })
    .catch(error => {
        respuesta = error;
    });
    return respuesta;
}

export const obtainServices = () => {
    const pathFile = resolve(process.cwd(), 'config.yml');
    const readConfig = readFileSync(pathFile, {encoding: 'utf8'});
    return load(readConfig, {json: true});
}

