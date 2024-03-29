function upload() {
    var img = document.getElementById("img").files[0];
    var text = document.getElementById('text')
    var p = document.getElementById('userImage')
    var t = img.type.split('/').pop().toLowerCase();
    if (typeof img ==="undefined") {
        p.value = " ";
        text.style.color = 'red';
        text.innerHTML = "You can't upload an empty file"
        return false
    } 
    var imgName = img.name
    if (img.size > 1 * 1024 * 1024) {
        text.style.color = "red"
            text.innerHTML = "File too large for upload(size limits:1mb)"
            setTimeout(function () {
               text.innerHTML = " " 
            },4000)
    } else if (t != "jpeg" && t != "jpg" && t != "png" && t != "jfif" && t != "gif") {
        text.style.color = "red"
        text.innerHTML = "Only image with .jpg/.jpeg/.png/.jfif/.gif is allowed"
        setTimeout(function () {
               text.innerHTML = " " 
            },4000)
    } else {
       var storageRef = firebase.storage().ref('Uploads/' + imgName);
        var task = storageRef.put(img);
    

    task.on('state_changed', function (snapshot) {
        var progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        if (progress < 100) {
            text.style.color = "blue"
            text.innerHTML = "upload is " + progress + '%' + " ready"
        } else {
            setTimeout(function () {
                text.style.color = "green"
                text.innerHTML = "Upload is 100% ready. Save to see your changes"
            }, 5000);
        }
       console.log("upload is " + progress + "done")
    }, function (error) {
     console.log(error.message)
    }, function () {
    task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log(downloadURL)
        p.value= downloadURL
    })
    });                     
}
}
