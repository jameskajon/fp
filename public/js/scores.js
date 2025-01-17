addLoadEvent(() => {
    const scores = $("#scoreModal");
    scores.on("show.bs.modal", () => fillScores(CURGAME));
});

/**
 *
 */
async function fillScores(game) {
    if (!game.gameId) {  // get game info off first game in dropdown
        const dataSet = document.getElementById("scoreGameDD").firstElementChild.dataset;
        game = {gameId: dataSet.gameId, name: dataSet.name, orderDir: dataSet.orderDir}
    }
    setScoresHeader(game.name);
    const allScoresDataPromise = getScores(game.gameId, game.orderDir);
    document.getElementById("globalScores").innerHTML = "";
    document.getElementById("userScores").innerHTML = "";
    document.getElementById("scoresLoading").classList.remove("d-none");
    const globalSource = document.getElementById("globalScoresBodyTemplate").innerHTML;
    const globalTemplate = Handlebars.compile(globalSource);
    const allScoresData = await allScoresDataPromise;
    document.getElementById("scoresLoading").classList.add("d-none");
    document.getElementById("globalScores").innerHTML = globalTemplate({scoresData: allScoresData});
    let userScoresData;
    if (auth.currentUser) {
        userScoresData = allScoresData.filter(score => score.user.uid === auth.currentUser.uid);
    } else {
        userScoresData = [];
        // TODO: Show waring about not being signed in
    }
    const userContext = {scoresData: userScoresData};
    const userSource = document.getElementById("userScoresBodyTemplate").innerHTML;
    const userTemplate = Handlebars.compile(userSource);
    document.getElementById("userScores").innerHTML = userTemplate(userContext);

}

async function getScores(gameId, orderDir) {
    const url = `/data/games/${gameId}/scores`;
    const request = new Request(url, {
        method: "POST",
        body: JSON.stringify({orderDir}),
        headers: {
            "Content-Type": "application/json",
        },
    });
    console.log(request);
    return fetch(request)
        .then((resp) => resp.json())
        .then(function( arr ) {
            // do something with the response
            return arr;
        })
        .catch(function (error) {
            console.log( error );
        });
}

function onGameChange(elm) {
    fillScores({gameId: elm.dataset.gameId, name: elm.dataset.name, orderDir: elm.dataset.orderDir});
}

function setScoresHeader(gameName) {
    document.querySelector("#scoreModal .modal-header .modal-title").textContent = gameName + " Scores"
}