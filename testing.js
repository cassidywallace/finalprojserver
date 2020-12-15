const axios = require('axios').default
token = ""
axios.get('http://localhost:3001/login').then((res) => {
    token = res.data.token
    const config = {
        headers: { Authorization: `Bearer ${token}`}
    };

    axios.get(
        'http://localhost:3001/budget',
        config
        ).then((res) => {
            console.log(res.data)
        }).catch((error)=>{
            //console.log(error)
        });
    }).catch((error)=>{
        console.log(error)
    })
