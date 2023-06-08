

$("#postContent").on("input", () => {
    let textAreaLength = $("#postContent").val().length
    $("#char-counter").text( textAreaLength);
});