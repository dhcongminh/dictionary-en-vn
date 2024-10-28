$("document").ready(() => {
    $("#theme-change-btn").on("click", () => {
        $("html").attr(
            'data-bs-theme',
            ($("html").attr('data-bs-theme') == "dark") ? "light" : "dark"
        );
        if ($("html").attr('data-bs-theme') == "dark") {
            $("#theme-change-btn").html(`<i class="fa-regular fa-sun"></i>`);
            $("nav.footer").removeClass("bg-white");
            $("nav.footer").addClass("bg-dark");
        } else {
            $("#theme-change-btn").html(`<i class="fa-regular fa-moon"></i>`);
            $("nav.footer").removeClass("bg-dark");
            $("nav.footer").addClass("bg-white");
        }
        setCookie('theme', $("html").attr('data-bs-theme'), 7);
    });
});

const savedTheme = getCookie('theme');
if (savedTheme) {
    $("html").attr('data-bs-theme', savedTheme);

    if ($("html").attr('data-bs-theme') == "dark") {
        $("#theme-change-btn").html(`<i class="fa-regular fa-sun"></i>`);
        $("nav.footer").removeClass("bg-white");
        $("nav.footer").addClass("bg-dark");
    } else {
        $("#theme-change-btn").html(`<i class="fa-regular fa-moon"></i>`);
        $("nav.footer").removeClass("bg-dark");
        $("nav.footer").addClass("bg-white");
    }
}








function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Thời hạn cookie
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cookieArr = document.cookie.split(';');
    for (let i = 0; i < cookieArr.length; i++) {
        let cookie = cookieArr[i].trim();
        if (cookie.indexOf(name + "=") == 0) {
            return cookie.substring((name + "=").length, cookie.length);
        }
    }
    return "";
}