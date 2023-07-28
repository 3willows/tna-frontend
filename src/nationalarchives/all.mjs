import { Card } from "./components/card/card.mjs";
import { Header } from "./components/header/header.mjs";
import { Picture } from "./components/picture/picture.mjs";
import { SensitiveImage } from "./components/sensitive-image/sensitive-image.mjs";
import { Tabs } from "./components/tabs/tabs.mjs";

const $body = document.documentElement;

$body.classList.add("tna-template--js-enabled");

const onFirstTouch = () => {
  window.removeEventListener("touchstart", onFirstTouch);
  $body.classList.add("tna-template--touched");
};

const onKeyDown = (e) => {
  if (e.key === "Tab") {
    $body.classList.add("tna-template--tabbed");
    $body.classList.remove("tna-template--clicked");
  }
};

const onMouseDown = () => {
  $body.classList.add("tna-template--clicked");
  $body.classList.remove("tna-template--tabbed");
};

window.addEventListener("touchstart", onFirstTouch);
window.addEventListener("keydown", onKeyDown);
window.addEventListener("mousedown", onMouseDown);

if (document.documentElement.classList.contains("tna-template--system-theme")) {
  if (window.matchMedia("(prefers-contrast: more)").matches) {
    document.documentElement.classList.add("tna-template--high-contrast-theme");
  } else {
    document.documentElement.classList.add(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "tna-template--dark-theme"
        : "tna-template--light-theme",
    );
  }
}

const initAll = (options) => {
  options = typeof options !== "undefined" ? options : {};
  const $scope =
    options.scope instanceof HTMLElement ? options.scope : document;

  const $header = $scope.querySelector('[data-module="tna-header"]');
  if ($header) {
    new Header($header).init();
  }

  const $cards = $scope.querySelectorAll('[data-module="tna-card"]');
  $cards.forEach(($card) => {
    new Card($card).init();
  });

  const $pictures = $scope.querySelectorAll('[data-module="tna-picture"]');
  $pictures.forEach(($picture) => {
    new Picture($picture).init();
  });

  const $sensitiveImages = $scope.querySelectorAll(
    '[data-module="tna-sensitive-image"]',
  );
  $sensitiveImages.forEach(($sensitiveImage) => {
    new SensitiveImage($sensitiveImage).init();
  });

  const $tabs = $scope.querySelectorAll('[data-module="tna-tabs"]');
  $tabs.forEach(($tabModule) => {
    new Tabs($tabModule).init();
  });
};

export { initAll, Header, SensitiveImage, Tabs };
