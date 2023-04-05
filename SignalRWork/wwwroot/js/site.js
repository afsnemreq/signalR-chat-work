$(document).ready(() => {
    let userName;
    let requestUrl = window.location + "myhub";
    var connection = new signalR.HubConnectionBuilder()
        .withUrl(requestUrl)
        .withAutomaticReconnect()
        .build();

    connection.start()
        .then(() => console.log("Bağlantı başarıyla gerçekleştirildi."))
        .catch(error => console.log("Bağlantı sağlanırken beklenmeyen bir hatayla karşılaşıldı."));

    $(".user-submit").click(() => {
        userName = $(".user-bar").val();
        $(".user-area").addClass("d-none");
        $(".chats").removeClass("d-none");
    });


    $(".btn-submit").click(() => {
        let message = capitalizeFirstLetter(userName + " : " + $(".message-bar").val());
        connection.invoke("SendMessageAsync", message)
            .catch(error => console.log("Mesaj gönderilirken hata alınmıştır."));

    });

    connection.on("receiveMessage", message => {

        connection.on("connectionId", connectionId => {

            if (connectionId == connection.connectionId && message != "") {
                $(".message-area").append(`<span class='my-messages-bar'>${message}<br></span><div></div>`);
            }
            else if (connectionId != connection.connectionId && message != "") {
                $(".message-area").append(`<span class='outher-messages-bar'>${message}<br></span><div></div>`);
            }

            message = "";
            $(".message-bar").val("");

            var element = document.getElementById("message-area");
            element.scrollTop = element.scrollHeight;
        });
    });


    connection.on("userJoined", connectionId => {

        $(".connection").html(`${connectionId} katıldı.`);
        $(".connection").show(2000, () => {
            setTimeout(() => {
                $(".connection").show(2000, () => {
                    $(".connection").hide(2000);
                })
            }, 2000);
        })
    });

    connection.on("userLeaved", connectionId => {
        $(".connection").html(`${connectionId} ayrıldı.`);
        $(".connection").show(2000, () => {
            setTimeout(() => {
                $(".connection").show(2000, () => {
                    $(".connection").hide(2000);
                })
            }, 2000);
        })
    });

    connection.on("clients", clients => {
        let lis = "";
        for (const client in clients) {
            lis += `${clients[client]}`;
        }
        $(".count").empty();
        $(".count").append(clients.length);
    });
});


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}