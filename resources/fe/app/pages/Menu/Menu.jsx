import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import FilterPopup from '../../components/popup/FilterPopup.jsx';
import {formatVietnameseCurrency} from '../../locales/currencyFormat.js';
import {Button, TextInput} from 'flowbite-react';
import {getCategories} from "../../redux/action/categoryAction.js";
import {getAllProducts} from "../../redux/action/productAction.js";
import DetailProductPopup from "../../components/popup/DetailProductPopup.jsx";
import Marketing from "./models/Marketing.jsx";
import ButtonElement from "../../components/element/ButtonElement.jsx";
import debounce from "lodash/debounce";
import {notify} from "../../layouts/notification/notify.jsx";
import {usePopup} from "../../hooks/contexts/popupContext/popupState.jsx";

const Menu = () => {
    //
    const dispatch = useDispatch();
    const dispatchProduct = useDispatch();

    // useState for filters
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchText, setSearchText] = useState('');
    const [filtersOption, setFiltersOption] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    // use state for load category and product
    const listCategory = useSelector(state => state.categories.categories);
    const listProduct = useSelector(state => state.products.products);
    const selectedProduct = useSelector(state => state.product.product);

    // popup state for handling detail product
    const {currentPopup, openPopup, closePopup, switchPopup} = usePopup();

    // const fetchData = async (isReload = false) => {
    //     // if (loading || !listProduct.hasMore) return;
    //     if(loading) return;
    //     setLoading(true);
    //     try {
    //         const form = {
    //             searchText: searchText,
    //             category_id: selectedCategory,
    //             minPrice: filtersOption.minPrice,
    //             maxPrice: filtersOption.maxPrice,
    //             fromDate: filtersOption.fromDate,
    //             toDate: filtersOption.toDate,
    //         };
    //
    //         await dispatch(getAllProducts(undefined, form)).then(() => {
    //
    //             // neu reload hoac listProduct rong thi setListProduct = newProducts
    //             if (listProduct.length === 0 || isReload) {
    //                 setListProduct(newProducts);
    //
    //
    //                 // console.log('listProduct', listProduct);
    //                 // console.log('newProducts', newProducts);
    //                 // console.log('listCategory', listCategory);
    //             } else {
    //                 const updatedList = listProduct.map(category => {
    //                     const newProduct = newProducts.find(p => p.category_id === category.category_id);
    //                     if (newProduct) {
    //                         return {
    //                             ...category,
    //                             product_list: category.product_list.concat(newProduct.product_list)
    //                         };
    //                     }
    //                     return category;
    //                 });
    //                 newProducts.forEach(category => {
    //                     if (!listProduct.some(p => p.category_id === category.category_id)) {
    //                         updatedList.push(category);
    //                     }
    //                 });
    //                 setListProduct(updatedList);
    //             }
    //         });
    //     } catch (error) {
    //         console.error("Failed to fetch products:", error);
    //     } finally {
    //         if (isReload) {
    //             scrollToDiv();
    //         }
    //         setLoading(false);
    //         setLoadingCategory(false);
    //         setSelectedCategory(null);
    //     }
    // };

    const scrollToDiv = () => {
        window.scrollTo({
            top: 400,
            behavior: 'smooth'
        });
    };

    // const changeSearchText = () => {
    //     setSearchText(searchTextInput);
    //     dispatch({ type: 'products/SET_LAST_PRODUCT_ID', payload: null });
    //     setHasMore(true);
    //     fetchData(true);
    // };

    // const handleScroll = () => {
    //     const scrollHeight = document.documentElement.scrollHeight;
    //     const scrollTop = window.scrollY;
    //     const clientHeight = window.innerHeight;
    //
    //     const scrolledToThreshold = (scrollTop + clientHeight) >= (scrollHeight * 0.8);
    //
    //     if (scrolledToThreshold && !isFetching.current) {
    //         isFetching.current = true;
    //         fetchData().finally(() => {
    //             isFetching.current = false;
    //         });
    //     }
    // };

    const handleFilterUpdate = (filters) => {
        setFiltersOption({...filters});
    };

    const fetchCategories = async () => {
        try {
            await dispatch(getCategories());
        } catch (error) {
            notify("error", "Failed to fetch categories");
        }
    };

    const fetchProducts = useCallback(
        debounce(async () => {
            // if (loading) return;
            const form = {
                searchText: searchText,
                category_id: selectedCategory,
                min_price: filtersOption.minPrice,
                max_price: filtersOption.maxPrice,
                fromDate: filtersOption.fromDate,
                toDate: filtersOption.toDate,
                order: filtersOption.order,
            };

            await dispatchProduct(getAllProducts(undefined, form));
            scrollToDiv();
        }, 500),
        [loading, searchText, selectedCategory, filtersOption, dispatchProduct]
    );

    const filterByCategory = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    // fetch data lan dau
    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    // xu ly tim theo loai, ten, filter
    // ngan chan render lan dau cho all filter
    const isFirstRenderForAllFilter = useRef(true);
    useEffect(() => {
        if (isFirstRenderForAllFilter.current) {
            isFirstRenderForAllFilter.current = false;
            return;
        }

        if (selectedCategory || searchText || filtersOption) {
            fetchProducts();
        }
    }, [selectedCategory, searchText, filtersOption]);

    const handleOpenDetailProduct = useCallback((product_id) => {
        return () => {
            openPopup({popupName: 'details', productId: product_id});
        };
    }, [openPopup]);

    // khong can useEffect vi khi currentPopup thay doi thi render lai
    // useEffect(() => {
    //     console.log('currentPopup in menu', currentPopup);
    // }, [currentPopup]);

    const buttonStyle =
        "btn w-full h-[50px]  text-white text-xs md:text-[16px] bg-[#f26d78] absolute cursor-pointer group-hover:bottom-0 -bottom-14 ";

    return (
        <div>
            {/* filter pop up */}
            {currentPopup?.popupName === 'filter' &&
                <FilterPopup isVisible={currentPopup?.popupName === "filter"} onApplyFilters={handleFilterUpdate}
                             closePopup={closePopup}/>}

            {/* Advert banner section */}
            <Marketing/>

            {/* Filter section */}
            <div className="flex items-center w-full max-w-[600px] space-x-2 p-2 rounded-2xl mx-auto mt-2">
                {/* Search */}
                <TextInput
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search for products"
                    className="outline-none border-2 border-gray-300 w-[350px] py-2 px-1 text-lg text-gray-900 border-none rounded-2xl h-12 flex items-center justify-center"
                    required
                />

                {/* Filter Button */}
                <Button pill onClick={() => openPopup({popupName: 'filter'})}
                        className="outline-none w-auto text-lg text-gray-900 border border-gray-300 rounded-2xl h-12 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                         stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"/>
                    </svg>
                    <span className="text-base ml-2">Filters</span>
                </Button>


                {/* Sort Button */}
                <Button pill onClick={() => setIsOpen(!isOpen)}
                        className="outline-none w-auto text-lg text-gray-900 border border-gray-300 rounded-2xl h-12 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"/>
                    </svg>
                    <span className="text-base ml-2">Sort</span>
                    {isOpen && (
                        <div
                            className="absolute right-0 top-[120%] bg-white shadow-lg rounded-md w-[140px] py-2 flex flex-col space-y-2 z-50">
                            <div
                                className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => setFiltersOption({...filtersOption, order: "desc"})}>
                                <span className="text-sm font-semibold">Giá: Giảm dần</span>
                            </div>
                            <div
                                className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => setFiltersOption({...filtersOption, order: "asc"})}>
                                <span className="text-sm font-semibold">Giá: Tăng dần</span>
                            </div>
                        </div>
                    )}
                </Button>
            </div>


            <div
                className="container min-h-[1000px] max-w-[1200px] mx-auto px-4 lg:px-4 grid grid-cols-12 gap-4 mt-1 lg:mt-5">
                {/*Left section : categories */}
                <div className="hidden md:block col-span-3 lg:border-r lg:border-gray-400 mr-5">
                    <h2 className="text-2xl font-bold mb-4">Danh mục sản phẩm</h2>
                    <ul>
                        <li onClick={() => filterByCategory('all')}
                            className={`mb-2 hover:text-[#6B4226] hover:translate-x-[3px] duration-300 cursor-pointer ${selectedCategory === null ? 'font-bold text-title-xsm text-[#6B4226]' : 'text-black'}`}>
                            Tất cả sản phẩm
                        </li>
                        {listCategory?.map(category => (
                            <li key={category.id} onClick={() => filterByCategory(category.id)}
                                className={`mb-2 hover:text-[#6B4226] hover:translate-x-[3px] duration-300 cursor-pointer ${selectedCategory === category.id ? 'font-bold text-title-xsm text-[#6B4226]' : 'text-black'}`}>
                                {category.name}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right section : products */}
                <div className="col-span-12 lg:col-span-9 grid grid-cols-1 lg:grid-cols-1 gap-0 lg:gap-4">
                    {loading ? (
                        [...Array(3)].map((_, n) => (
                            <div key={n} className="mb-6">
                                <div className="h-8 bg-gray-200 rounded w-1/3 ml-4 animate-pulse"></div>
                                <div
                                    className="col-span-12 lg:col-span-9 grid grid-cols-2 lg:grid-cols-3 gap-0 lg:gap-4 mt-4">
                                    {[...Array(6)].map((_, m) => (
                                        <div key={m} className="p-4">
                                            <div
                                                className="w-full bg-gray-200 rounded-lg aspect-square animate-pulse"></div>
                                            <div className="product_content flex flex-row justify-between mt-4">
                                                <div className="product_label w-full">
                                                    <div
                                                        className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
                                                    <div
                                                        className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        listProduct?.map(category => (
                            <div key={category.category_id}>
                                <span
                                    className="text-3xl font-bold text-black-2 ml-4">{category.category_name}</span>
                                <div
                                    className="col-span-12 lg:col-span-9 grid grid-cols-2 lg:grid-cols-3 gap-0 lg:gap-4 mt-4">
                                    {category.product_list.map(product => (
                                        <div key={product.product_id} className="p-4 cursor-pointer">
                                            <div
                                                className="bg-gray-200/50 rounded-md relative mb-4 max-h-[250px] group overflow-hidden">
                                                <img
                                                    src={product.product_image || "/build/assets/Product/empty-image.png"}
                                                    alt="Product"
                                                    className="w-full shadow-lg rounded-lg aspect-square "/>
                                                <ButtonElement
                                                    value={product.product_id}
                                                    action={handleOpenDetailProduct(product.product_id)}
                                                    style={buttonStyle}
                                                    title="Add to Cart"
                                                />
                                            </div>

                                            <div className="product_content flex flex-row justify-between mt-4 ">
                                                <div className="product_label">
                                                    <h3 className="font-bold text-black truncate w-52">{product.product_name}</h3>
                                                    <p className="text-gray-600 text-xs lg:text-sm">{formatVietnameseCurrency(product.product_price)}</p>
                                                </div>
                                                <div className="flex justify-center items-center mb-3 lg:mb-0">
                                                    <button onClick={handleOpenDetailProduct(product.product_id)}
                                                            className="add_btn flex justify-center items-center p-1 bg-[#f26d78] hover:bg-[#C15760]">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                             viewBox="0 0 24 24" strokeWidth="1.5" stroke="white"
                                                             className="size-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  d="M12 4.5v15m7.5-7.5h-15"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Menu;
