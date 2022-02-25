const express = require('express')

const router = express.Router()


router.get('/', (req, res) => {
    res.send('Welcome to my image app')
})

router.get('/images/get', (req, res) => {
    req.getConnection((err, conn) => {
        if (err)
            return res.status(500).send('server error')

        console.log('images get...')
        var sql = "select name from image"
        conn.query(sql, function (err, result) {
            if (err) {
                throw err;
            } else {
                console.log(result)

                // res.render("recipes_response", { data: result[0].image.toString('base64'), rname: result[0].rname});

                return res.send({ data: result })
                //   res.render("recipes_response", { data: result[0].image.toString('base64'), rname: result[0].rname });
            }
        });
    })
})

router.post('/images/post', (req, res) => {

    console.log(req.body.body)

    req.getConnection((err, conn) => {
        if (err) return res.status(500).send('server error')

        conn.query('INSERT INTO image set ?', [req.body.body], (err, rows) => {
            if (err)
                return res.status(500).send('server error')
            res.send('image saved!')
        })
    })

})

module.exports = router