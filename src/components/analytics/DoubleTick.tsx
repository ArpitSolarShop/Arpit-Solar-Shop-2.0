"use client";
import Script from "next/script";

export default function DoubleTick() {
    return (
        <Script
            id="doubletick-widget"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
                __html: `
        (function (w, d, s, o, f, js, fjs) {
          w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments); };
          (js = d.createElement(s)), (fjs = d.getElementsByTagName(s)[0]);
          js.id = o; js.src = f; js.async = 1;
          fjs.parentNode.insertBefore(js, fjs);
        })(window, document, "script", "dt", "https://d3r49s2alut4u1.cloudfront.net/js/widget.js");
        dt("init", {
          crmWidgetId: "c950f0d3-85af-4949-af36-fc597a0bda7f",
          companyName: "Arpit Solar Shop",
          companyLogoUrl: "",
          phoneNumber: "919044555572"
        });
      `}}
        />
    );
}
