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
            console.log("Data: " + data);
        });
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

            let noteButton = $("<button>", { "data-id": data[i]._id, "class": "note-button button" }).text("View Note")
            cardBody.append(description);

            let unSaveButton = $("<button>", { "data-id": data[i]._id, "class": "unsave-button button" }).text("Save This!");
            cardBody.append(unSaveButton);

            card.append(cardBody);

            $("#saved-articles").append(card);
        }
    });
}