import React, {useEffect, useRef, useState} from "react";


const Banner = () => {
    // Dynamically import all images from the banner directory
    // const importAll = (r) => r.keys().map(r);
    // const images = importAll(require.context('@/assets/banner', false, /\.(png|jpe?g|svg)$/));
    const images = import.meta.glob('/resources/fe/app/assets/banner/*.{png,jpg,jpeg,svg}', { eager: true });

    console.log(images);

    const currentImageIndexRef = useRef(0); // Dùng useRef thay vì useState
    const imageRef = useRef(null); // Tham chiếu đến thẻ <img>
    const [imageList, setImageList] = useState(Object.values(images).map(img => img.default));

    // get images from selectedProduct
    // useEffect(() => {
    //     if (selectedProduct) {
    //         setImages([
    //             selectedProduct.image_url,
    //             ...(selectedProduct.productDetailImages || []).map(img => img.image_url)
    //         ]);
    //     }
    // }, [selectedProduct]);

    // auto change imageList
    useEffect(() => {
        if (imageList.length > 0) {
            const interval = setInterval(() => {
                currentImageIndexRef.current = (currentImageIndexRef.current + 1) % imageList.length;
                if (imageRef.current) {
                    imageRef.current.src = imageList[currentImageIndexRef.current]; // Cập nhật ảnh trực tiếp
                }
            }, 3000); // 3s đổi ảnh một lần

            return () => clearInterval(interval);
        }
    }, [imageList]);

    // style={{ backgroundImage: "url('/build/assets/Banner.svg')" }}
    return (
        <section className="relative h-[480px] w-[1200px] flex items-center justify-center bg-cover bg-center mx-auto mt-8 rounded-2xl">
            {/* Left Arrow Button */}
            <button
                onClick={() => {
                    currentImageIndexRef.current = (currentImageIndexRef.current - 1 + imageList.length) % imageList.length;
                    if (imageRef.current) {
                        imageRef.current.src = imageList[currentImageIndexRef.current];
                    }
                }}
                className="absolute left-8 inset-y-1/2 transform -translate-y-1/2 bg-white text-black w-12 h-12 flex items-center justify-center rounded-full shadow-2xl opacity-80 hover:opacity-100 transition-opacity duration-300">
                &lt;
            </button>

            {/* Image */}
            <img
                ref={imageRef}
                src={imageList[0] || "@/assets/imageList/empty-image.jpg"}
                alt="Product Image"
                className="w-[1200px] h-[480px] object-cover rounded-lg"
            />

            {/* Right Arrow Button */}
            <button
                onClick={() => {
                    currentImageIndexRef.current = (currentImageIndexRef.current + 1) % imageList.length;
                    if (imageRef.current) {
                        imageRef.current.src = imageList[currentImageIndexRef.current];
                    }
                }}
                className="absolute right-8 inset-y-1/2 transform -translate-y-1/2 bg-white text-black w-12 h-12 flex items-center justify-center rounded-full shadow-2xl opacity-80 hover:opacity-100 transition-opacity duration-300">
                &gt;
            </button>
        </section>
    );
};

export default Banner;

