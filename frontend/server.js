const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 5000

// make sure you amend the path.
// in this case the react application will be packaged in the build directory
// we use '/*' so that we don't get the typical error "Cannot GET"
app.use(express.static(path.join(__dirname, '/build')))
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

app.listen(port, () => console.log("Listening on Port", port))