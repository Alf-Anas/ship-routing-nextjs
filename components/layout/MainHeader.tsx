import Link from "next/link";
import MenuDestination from "../destination/MenuDestination";

export default function MainHeader() {
    return (
        <nav
            className="bg-white border-gray-200 dark:bg-gray-900"
            id="main-layout-header"
        >
            <div className="flex flex-wrap items-center mx-auto p-4">
                <MenuDestination />
                <Link href="/" className="flex items-center ml-4">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                        SHIP ROUTE
                    </span>
                </Link>
                <div className="flex md:order-2 gap-2">
                    <div className="relative"></div>
                    {/* <ModalAddCat /> */}
                </div>
            </div>
        </nav>
    );
}
