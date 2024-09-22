import { el,setChildren } from "redom"
import Navigo from "navigo"
import * as bootstrap from 'bootstrap'

const router = new Navigo("/");
function navigate(e){
    e.preventDefault();
    router.navigate(e.target.getAttribute("href"));
}

function postPage(id) {
    const body = el("div", {className: "card"}, "Loding...");
    fetch(`https://gorest.co.in/public/v2/posts/${id}`).then(async (res) => {
        const data = await res.json();
        setChildren(body, 
            el(
                "div", { className: "card-body"},
                [
                    el ("h2", data.title),
                    el ("p", data.body),

                    el(
                        "a", {className: "btn btn-primary   "},
                        {
                            href : "/",
                            onclick: navigate,
                        },
                        "Вернуться к списку"
                    ),
                ],
            ),
        );
    });
    return el("div", { className: "container" }, [el("h1", "Post"), body]);
}

function postListPage() {
    const list = el("ul", { className: "list-group list-group-flush"}, el("li", "Loading..."));
    fetch("https://gorest.co.in/public/v2/posts").then(async (res) => {
        const data = await res.json();

        setChildren(
            list,
            data.map((post) =>
                el(
                    "li", { className: "list-group-item"},
                    el(
                        "a",
                        {
                            href: `/posts/${post.id}`,
                            onclick: navigate,
                        },
                        post.title
                    )
                )
            )
        );
    });
    return el("div", {className: "container"}, [el("h1","Post list"), list]);
}


router.on("/", () => {
    setChildren(window.document.body, postListPage());
});
router.on("/posts/:id",({ data: {id } }) => {
    setChildren(window.document.body,postPage(id));
});
router.resolve();