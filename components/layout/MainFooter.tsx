export default function MainFooter() {
    return (
        <footer
            className="bg-white shadow p-2 dark:bg-gray-800"
            id="main-layout-footer"
        >
            <div className="w-full mx-auto max-w-screen-xl p-2">
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                    © 2023{" "}
                    <a
                        href="https://geoit.dev/"
                        target="_blank"
                        className="hover:underline"
                    >
                        GeoIT Developer
                    </a>
                    . All Rights Reserved.
                </p>
            </div>
        </footer>
    );
}
