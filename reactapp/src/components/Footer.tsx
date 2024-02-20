


const Footer: React.FC = () => {
    return (
        <footer className="fixed bottom-0 left-0 w-full bg-purple-800 text-white text-center p-3">
            <div className="container mx-auto flex justify-between items-center">
                <p className="text-lg ">Join to us to get all features!</p>
                <button className="px-4 py-2 rounded bg-white hover:bg-gray-200 text-black font-bold">
                    Sign Up
                </button>
            </div>
        </footer>

    );
};

export default Footer;
