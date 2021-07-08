function upload() {
    var img = document.getElementById("img").files[0];
    var imgName = img.name;

    var storageRef = firebase.storage().ref('Uploads/' + imgName);

    var task = storageRef.put(img);

    task.on('state_changed', function (snapshot) {
        var progress = parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        var text = document.getElementById('text')
        if (img.size > 2 * 1024 * 1024) {
            text.style.color = "red"
            text.innerHTML = "File too large for upload(size limits:2mb)"
            return false
        } else {
            var t = img.type.split('/').pop().toLowerCase();
          if (t != "jpeg" && t != "jpg" && t != "png" && t != "jfif" && t != "gif") {
            text.style.color = "red"
            text.innerHTML = "Only image with .jpg/.jpeg/.png/.jfif/.gif is allowed"
            return false
            }
            else {
              if (progress < 100) {
            text.style.color = "blue"
            text.innerHTML = "upload is " + progress+'%' + " ready"
            } else {
            text.style.color = "green"
            text.innerHTML= "Upload is 100% ready. Save to see your changes"
        }
            }
        }
         
        
        
        
       console.log("upload is " + progress + "done")
    }, function (error) {
     console.log(error.message)
    }, function () {
    task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log(downloadURL)
        var p = document.getElementById('userImage')
        p.value= downloadURL
    })
});    
                                      
 }