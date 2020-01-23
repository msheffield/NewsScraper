$(document).ready(function () {
    console.log("Loaded collection page");
    loadSavedArticles();

    $(document).on("click", ".unsave-button", function () {
        let id = $(this).attr("data-id");

        $.ajax({
            method: "POST",
            url: "/unsave/" + id,
            data: {
                saved: false
            }
        }).done(function (data) {
            window.location = "/";
        });
    });

    $(document).on("click", ".note-button", function () {


        let id = $(this).attr("data-id");
        $(".note-save").attr({ "data-id": id })

        $.ajax({
            method: "GET",
            url: "/article/" + id,
            data: {}
        }).done(function (data) {
            let body = $(".modal-body");
            body.empty();
            
            $(".note-save").attr({ "data-id": id });

            console.log(data.comment);

            //for (let i = 0; i < data.length; i++) {
            let comment = $("<div>");
            comment.attr({ "class": "row" })

            let text = $("<p>").text(data.comment.body);
            comment.append(text);

            let deleteButton = $("<button>");
            deleteButton.attr({ "data-id": data.comment._id, "class": "note-delete close", "type": "button", "aria-label":"close"});
            comment.append(deleteButton);

            body.append(comment);
            //}
        });
    });

    $(document).on("click", ".note-save", function () {
        let id = $(this).attr("data-id");
        let body = $("#new-comment").val();

        console.log("Saving note with id: " + id + " and body: " + body);

        $.ajax({
            method: "POST",
            url: "/addComment/" + id,
            data: {
                body: body
            }
        }).done(function (data) {
            console.log(data);
        });

        $("#new-comment").val("");
    });
});

// Load Saved Articles from DB
function loadSavedArticles() {
    $.getJSON("/saved", function (data) {
        console.log("getting articles...");
        for (let i = 0; i < data.length; i++) {
            let card = $("<div>", { id: data[i]._id, "class": "card" });

            let cardBody = $("<div>", { "class": "card-body" });

            let cardTitle = $("<div>");
            let link = $("<a>", { "href": data[i].link })
            let title = $("<h5>").text(data[i].title);
            link.append(title);
            cardTitle.append(link);
            cardBody.append(cardTitle);

            let description = $("<p>", { "class": "card-text" }).text(data[i].description + "...");
            cardBody.append(description);

            let noteButton = $("<button>", { "data-id": data[i]._id, "class": "note-button button", "data-toggle": "modal", "data-target": "#note-modal" }).text("View Notes")
            cardBody.append(noteButton);

            let unSaveButton = $("<button>", { "data-id": data[i]._id, "class": "unsave-button button" }).text("Remove Article");
            cardBody.append(unSaveButton);

            card.append(cardBody);

            $("#saved-articles").append(card);
        }
    });
}