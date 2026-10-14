import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'

import Container from '../../components/ui/Container'
import PageHeader from '../../components/ui/PageHeader'
import CatalogProductCard from './CatalogProductCard'
import { productApi } from '../../api/productApi'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'


/*
 * ========================================================================
 * CẤU HÌNH HIỂN THỊ
 * ========================================================================
 *
 * Hiện tại dùng client-side pagination để demo.
 * Sau này Backend có thể trả trực tiếp:
 *
 * {
 *   items: [],
 *   page: 1,
 *   pageSize: 12,
 *   totalItems: 100,
 *   totalPages: 9
 * }
 *
 * Khi đó phần UI bên dưới gần như không cần thay đổi.
 */
const PRODUCTS_PER_PAGE = 12

const DEFAULT_SORT = 'recommended'

const SORT_OPTIONS = [
    {
        value: 'recommended',
        label: 'Đề xuất',
    },
    {
        value: 'newest',
        label: 'Mới nhất',
    },
    {
        value: 'best-selling',
        label: 'Bán chạy',
    },
    {
        value: 'most-viewed',
        label: 'Xem nhiều',
    },
    {
        value: 'price-asc',
        label: 'Giá thấp → cao',
    },
    {
        value: 'price-desc',
        label: 'Giá cao → thấp',
    },
]

const DEFAULT_FILTERS = {
    categoryId: '',
    minPrice: '',
    maxPrice: '',
    color: '',
    size: '',
}

export default function Catalog() {
    const [searchParams, setSearchParams] =
        useSearchParams()
    const [showScrollTop, setShowScrollTop] = useState(false)

    useEffect(() => {
        const updateScrollButton = () => {
            setShowScrollTop(window.scrollY > 360)
        }

        updateScrollButton()
        window.addEventListener('scroll', updateScrollButton, { passive: true })

        return () => {
            window.removeEventListener('scroll', updateScrollButton)
        }
    }, [])

    // Dữ liệu Catalog lấy từ API; không tự fallback về mock khi API lỗi.
    const productsQuery = useQuery({
        queryKey: ['products', 'catalog'],
        queryFn: productApi.getAll,
        staleTime: 60 * 1000,
    })

    const availableProducts = useMemo(
        () => (
            Array.isArray(productsQuery.data)
                ? productsQuery.data
                : []
        ),
        [productsQuery.data],
    )

    /*
     * ====================================================================
     * STATE
     * ====================================================================
     */

    const [searchText, setSearchText] = useState(
        searchParams.get('search') || '',
    )

    const [filters, setFilters] = useState({
        categoryId:
            searchParams.get('category') || '',
        minPrice:
            searchParams.get('minPrice') || '',
        maxPrice:
            searchParams.get('maxPrice') || '',
        color:
            searchParams.get('color') || '',
        size:
            searchParams.get('size') || '',
    })

    const [sortBy, setSortBy] = useState(
        searchParams.get('sort') || DEFAULT_SORT,
    )

    const [currentPage, setCurrentPage] =
        useState(
            Number(
                searchParams.get('page') || 1,
            ),
        )

    /*
     * ====================================================================
     * OPTIONS CHO FILTER
     * ====================================================================
     */

    const filterOptions = useMemo(() => {
        const colors = [
            ...new Set(availableProducts.flatMap((product) => product.colors || [])),
        ].sort((a, b) => a.localeCompare(b, 'vi'))

        const sizes = [
            ...new Set(availableProducts.flatMap((product) => product.sizes || [])),
        ].sort((a, b) => a.localeCompare(b, 'vi', { numeric: true }))

        const prices = availableProducts
            .map((product) => Number(product.price))
            .filter(Number.isFinite)

        const categoriesById = new Map()
        availableProducts.forEach((product) => {
            if (product.categoryId != null && product.categoryName) {
                categoriesById.set(String(product.categoryId), {
                    id: product.categoryId,
                    name: product.categoryName,
                })
            }
        })

        return {
            colors,
            sizes,
            categories: [...categoriesById.values()].sort((a, b) =>
                a.name.localeCompare(b.name, 'vi'),
            ),
            minPrice: prices.length > 0 ? Math.min(...prices) : 0,
            maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
        }
    }, [availableProducts])

    /*
     * ====================================================================
     * SEARCH
     * ====================================================================
     *
     * Sản phẩm đã được tải từ API. Tìm kiếm hiện vẫn thực hiện ở client
     * để giữ nguyên bộ lọc và hành vi phân trang của Catalog.
     */

    const searchedProducts = useMemo(() => {
        const keyword =
            searchText.trim().toLowerCase()

        if (!keyword) {
            return availableProducts
        }

        return availableProducts.filter(
            (product) => {
                const name =
                    product.name?.toLowerCase() || ''

                const description =
                    product.description
                        ?.toLowerCase() || ''

                const category =
                    product.categoryName
                        ?.toLowerCase() || ''

                return (
                    name.includes(keyword) ||
                    description.includes(keyword) ||
                    category.includes(keyword)
                )
            },
        )
    }, [searchText, availableProducts])

    /*
     * ====================================================================
     * PRODUCT LIST
     * ====================================================================
     *
     * Chuẩn hóa phép lọc, sắp xếp và phân trang trên dữ liệu API.
     * Thẻ riêng cho Catalog dùng DTO thống nhất do ProductController trả về.
     */

    const productList = useMemo(() => {
        const originalProducts =
            availableProducts

        /*
         * Dùng danh sách sản phẩm đã tải từ API để áp dụng tìm kiếm.
         */
        const sourceProducts =
            searchText.trim()
                ? searchedProducts
                : originalProducts

        let products = [...sourceProducts]

        // ------------------------------------------------------------
        // FILTER
        // ------------------------------------------------------------

        if (filters.categoryId) {
            products = products.filter(
                (product) =>
                    String(
                        product.categoryId,
                    ) ===
                    String(filters.categoryId),
            )
        }

        if (filters.color) {
            products = products.filter(
                (product) =>
                    product.colors?.includes(
                        filters.color,
                    ),
            )
        }

        if (filters.size) {
            products = products.filter(
                (product) =>
                    product.sizes?.includes(
                        filters.size,
                    ),
            )
        }

        if (filters.minPrice !== '') {
            products = products.filter(
                (product) =>
                    product.price >=
                    Number(filters.minPrice),
            )
        }

        if (filters.maxPrice !== '') {
            products = products.filter(
                (product) =>
                    product.price <=
                    Number(filters.maxPrice),
            )
        }

        // ------------------------------------------------------------
        // SORT
        // ------------------------------------------------------------

        switch (sortBy) {
            case 'newest':
                products.sort(
                    (a, b) =>
                        new Date(
                            b.createdAt,
                        ) -
                        new Date(
                            a.createdAt,
                        ),
                )
                break

            case 'best-selling':
                products.sort(
                    (a, b) =>
                        b.soldCount -
                        a.soldCount,
                )
                break

            case 'most-viewed':
                products.sort(
                    (a, b) =>
                        b.viewCount -
                        a.viewCount,
                )
                break

            case 'price-asc':
                products.sort(
                    (a, b) =>
                        a.price - b.price,
                )
                break

            case 'price-desc':
                products.sort(
                    (a, b) =>
                        b.price - a.price,
                )
                break

            case 'recommended':
            default:
                products.sort(
                    (a, b) =>
                        b.soldCount +
                        b.viewCount -
                        (a.soldCount +
                            a.viewCount),
                )
                break
        }

        // ------------------------------------------------------------
        // PAGINATION
        // ------------------------------------------------------------

        const totalItems =
            products.length

        const totalPages = Math.max(
            1,
            Math.ceil(
                totalItems /
                PRODUCTS_PER_PAGE,
            ),
        )

        const safePage = Math.min(
            Math.max(
                currentPage,
                1,
            ),
            totalPages,
        )

        const startIndex =
            (safePage - 1) *
            PRODUCTS_PER_PAGE

        const items = products.slice(
            startIndex,
            startIndex +
            PRODUCTS_PER_PAGE,
        )

        return {
            items,
            page: safePage,
            pageSize:
            PRODUCTS_PER_PAGE,
            totalItems,
            totalPages,
        }
    }, [
        availableProducts,
        searchedProducts,
        searchText,
        filters,
        sortBy,
        currentPage,
    ])

    /*
     * ====================================================================
     * ĐỒNG BỘ URL
     * ====================================================================
     *
     * Ví dụ:
     *
     * /catalog?page=2&sort=best-selling&category=1
     *
     * Việc đưa state lên URL giúp:
     * - F5 không mất trạng thái trang
     * - copy URL
     * - sau này API có thể dùng chính các param này
     */

    useEffect(() => {
        const params = {}

        if (searchText.trim()) {
            params.search =
                searchText.trim()
        }

        if (filters.categoryId) {
            params.category =
                filters.categoryId
        }

        if (filters.minPrice !== '') {
            params.minPrice =
                filters.minPrice
        }

        if (filters.maxPrice !== '') {
            params.maxPrice =
                filters.maxPrice
        }

        if (filters.color) {
            params.color =
                filters.color
        }

        if (filters.size) {
            params.size =
                filters.size
        }

        if (sortBy !== DEFAULT_SORT) {
            params.sort = sortBy
        }

        if (productList.page > 1) {
            params.page =
                productList.page
        }

        setSearchParams(
            params,
            {
                replace: true,
            },
        )
    }, [
        searchText,
        filters,
        sortBy,
        productList.page,
        setSearchParams,
    ])

    /*
     * ====================================================================
     * RESET PAGE
     * ====================================================================
     *
     * Khi filter / search / sort thay đổi,
     * luôn quay về trang 1.
     */


    /*
     * ====================================================================
     * EVENT HANDLERS
     * ====================================================================
     */

    const updateFilter = (
        name,
        value,
    ) => {
        setFilters(
            (previous) => ({
                ...previous,
                [name]: value,
            }),
        )

        setCurrentPage(1)
    }

    const clearFilters = () => {
        setSearchText('')
        setFilters({
            ...DEFAULT_FILTERS,
        })
        setSortBy(DEFAULT_SORT)
        setCurrentPage(1)
    }

    const handleSortChange = (value) => {
        setSortBy(value)
        setCurrentPage(1)
    }

    const handlePageChange = (
        page,
    ) => {
        if (
            page < 1 ||
            page > productList.totalPages
        ) {
            return
        }

        setCurrentPage(page)

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }

    const hasFilters = Boolean(
        searchText.trim() ||
        filters.categoryId ||
        filters.minPrice !== '' ||
        filters.maxPrice !== '' ||
        filters.color ||
        filters.size,
    )

    /*
     * API thật được gọi qua src/api/productApi.js theo quy ước README.
     * useQuery xử lý cache; phần tìm kiếm/lọc/sắp xếp/phân trang vẫn ở client.
     */

    /*
     * ====================================================================
     * RENDER
     * ====================================================================
     */

    return (
        <div className="min-h-screen bg-[#fefccf] text-zinc-900">
            <Container className="py-8 sm:py-10 lg:py-12">

                <PageHeader
                    title="Khám phá sản phẩm"
                    description="Tìm kiếm và khám phá những sản phẩm phù hợp với phong cách của bạn."
                />

                {/* ========================================================
                    SEARCH + SORT
                   ======================================================== */}

                <section className="mt-8 rounded-3xl border border-[#e5d3a2] bg-gradient-to-br from-[#fffaf0] via-white to-[#f4ebd5] p-4 shadow-[0_16px_40px_rgba(91,65,20,0.09)] ring-1 ring-white/80 sm:p-6">
                    <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#f0592a]">Tìm đúng phong cách</p>
                            <h2 className="mt-1 text-lg font-bold tracking-tight text-zinc-950 sm:text-xl">Tìm kiếm & sắp xếp</h2>
                        </div>
                        <p className="text-sm text-zinc-500">Lọc nhanh để tìm sản phẩm phù hợp</p>
                    </div>

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="w-full lg:max-w-xl">
                            <label
                                htmlFor="catalog-search"
                                className="mb-2 block text-sm font-bold text-zinc-800"
                            >
                                Tìm kiếm
                            </label>

                            <Input
                                id="catalog-search"
                                type="text"
                                value={searchText}
                                placeholder="Thử: áo thun, hoodie, polo..."
                                className="rounded-xl border-[#d7c69a] bg-white py-3.5 shadow-sm placeholder:text-zinc-400"
                                onChange={(event) => {
                                    setSearchText(
                                        event.target
                                            .value,
                                    )
                                    setCurrentPage(1)
                                }}
                            />
                        </div>

                        <div className="w-full lg:w-56">
                            <label
                                htmlFor="catalog-sort"
                                className="mb-2 block text-sm font-bold text-zinc-800"
                            >
                                Sắp xếp
                            </label>

                            <select
                                id="catalog-sort"
                                value={sortBy}
                                onChange={(event) =>
                                    handleSortChange(
                                        event.target
                                            .value,
                                    )
                                }
                                className="w-full rounded-xl border border-[#d7c69a] bg-white px-4 py-3.5 text-sm font-semibold text-zinc-800 shadow-sm outline-none transition-all hover:border-[#c5aa6e] focus:border-[#f0592a] focus:ring-4 focus:ring-[#f0592a]/15"
                            >
                                {SORT_OPTIONS.map(
                                    (option) => (
                                        <option
                                            key={
                                                option.value
                                            }
                                            value={
                                                option.value
                                            }
                                        >
                                            {
                                                option.label
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>
                    </div>
                </section>

                {/* ========================================================
                    FILTER + PRODUCT LIST
                   ======================================================== */}

                <div className="mt-8 grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:gap-8">

                    {/* ====================================================
                        SIDEBAR
                       ==================================================== */}

                    <aside className="h-fit rounded-2xl border border-[#e3d0a0] bg-gradient-to-b from-[#fffaf0] to-[#f7efd9] p-5 shadow-[0_14px_35px_rgba(91,65,20,0.10)] lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-base font-extrabold text-zinc-950">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f0592a] text-white shadow-sm" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16M7 12h10m-7 7h4" />
                    </svg>
                  </span>
                                Bộ lọc sản phẩm
                            </h2>

                            {hasFilters && (
                                <button
                                    type="button"
                                    onClick={
                                        clearFilters
                                    }
                                    className="rounded-full border border-[#f0592a]/25 bg-white/80 px-3 py-1.5 text-xs font-bold text-[#d94a1f] transition-all hover:border-[#f0592a] hover:bg-[#fff0e8]"
                                >
                                    Xóa
                                </button>
                            )}
                        </div>

                        {/* Category */}

                        <div className="mt-6">
                            <label
                                htmlFor="category-filter"
                                className="text-sm font-semibold text-zinc-900"
                            >
                                Danh mục
                            </label>

                            <select
                                id="category-filter"
                                value={
                                    filters.categoryId
                                }
                                onChange={(
                                    event,
                                ) =>
                                    updateFilter(
                                        'categoryId',
                                        event.target
                                            .value,
                                    )
                                }
                                className="mt-2 w-full rounded-lg border border-[#d7c69a] bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition-all hover:border-[#c5aa6e] focus:border-[#f0592a] focus:ring-4 focus:ring-[#f0592a]/15"
                            >
                                <option value="">
                                    Tất cả
                                </option>

                                {filterOptions.categories.map(
                                    (
                                        category,
                                    ) => (
                                        <option
                                            key={
                                                category.id
                                            }
                                            value={
                                                category.id
                                            }
                                        >
                                            {
                                                category.name
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>

                        {/* Price */}

                        <div className="mt-6">
                            <p className="text-sm font-semibold text-zinc-900">
                                Khoảng giá
                            </p>

                            <div className="mt-2 grid grid-cols-2 gap-2">
                                <Input
                                    type="number"
                                    placeholder={`Từ ${filterOptions.minPrice.toLocaleString(
                                        'vi-VN',
                                    )}`}
                                    value={
                                        filters.minPrice
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        updateFilter(
                                            'minPrice',
                                            event.target
                                                .value,
                                        )
                                    }
                                />

                                <Input
                                    type="number"
                                    placeholder={`Đến ${filterOptions.maxPrice.toLocaleString(
                                        'vi-VN',
                                    )}`}
                                    value={
                                        filters.maxPrice
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        updateFilter(
                                            'maxPrice',
                                            event.target
                                                .value,
                                        )
                                    }
                                />
                            </div>
                        </div>

                        {/* Color */}

                        <div className="mt-6">
                            <label
                                htmlFor="color-filter"
                                className="text-sm font-semibold text-zinc-900"
                            >
                                Màu sắc
                            </label>

                            <select
                                id="color-filter"
                                value={
                                    filters.color
                                }
                                onChange={(
                                    event,
                                ) =>
                                    updateFilter(
                                        'color',
                                        event.target
                                            .value,
                                    )
                                }
                                className="mt-2 w-full rounded-lg border border-[#d7c69a] bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition-all hover:border-[#c5aa6e] focus:border-[#f0592a] focus:ring-4 focus:ring-[#f0592a]/15"
                            >
                                <option value="">
                                    Tất cả
                                </option>

                                {filterOptions.colors.map(
                                    (color) => (
                                        <option
                                            key={
                                                color
                                            }
                                            value={
                                                color
                                            }
                                        >
                                            {color}
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>

                        {/* Size */}

                        <div className="mt-6">
                            <label
                                htmlFor="size-filter"
                                className="text-sm font-semibold text-zinc-900"
                            >
                                Kích thước
                            </label>

                            <select
                                id="size-filter"
                                value={
                                    filters.size
                                }
                                onChange={(
                                    event,
                                ) =>
                                    updateFilter(
                                        'size',
                                        event.target
                                            .value,
                                    )
                                }
                                className="mt-2 w-full rounded-lg border border-[#d7c69a] bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition-all hover:border-[#c5aa6e] focus:border-[#f0592a] focus:ring-4 focus:ring-[#f0592a]/15"
                            >
                                <option value="">
                                    Tất cả
                                </option>

                                {filterOptions.sizes.map(
                                    (size) => (
                                        <option
                                            key={size}
                                            value={size}
                                        >
                                            {size}
                                        </option>
                                    ),
                                )}
                            </select>
                        </div>
                    </aside>

                    {/* ====================================================
                        PRODUCTS
                       ==================================================== */}

                    <section>
                        <div className="mb-5 flex flex-col gap-2 rounded-2xl border border-[#e7d7ae] bg-white/75 px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm font-medium text-zinc-600">
                                {productsQuery.isLoading
                                    ? 'Đang tải sản phẩm...'
                                    : productsQuery.isError
                                        ? 'Không thể tải sản phẩm'
                                        : productList.totalItems === 0
                                            ? 'Không có sản phẩm'
                                            : `Hiển thị ${
                                                (productList.page -
                                                    1) *
                                                productList.pageSize +
                                                1
                                            } – ${Math.min(
                                                productList.page *
                                                productList.pageSize,
                                                productList.totalItems,
                                            )} trên tổng số ${
                                                productList.totalItems
                                            } sản phẩm`}
                            </p>

                            <p className="inline-flex w-fit items-center rounded-full bg-[#f6eed2] px-3 py-1 text-xs font-bold text-zinc-700">
                                Trang{' '}
                                {
                                    productList.page
                                }{' '}
                                /{' '}
                                {
                                    productList.totalPages
                                }
                            </p>
                        </div>

                        {productsQuery.isLoading ? (
                            <div aria-live="polite" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="overflow-hidden rounded-2xl border border-[#e4d6b2] bg-[#fffdf7] p-3 shadow-sm">
                                        <div className="aspect-[4/5] animate-pulse rounded-xl bg-[#eee5d0]" />
                                        <div className="space-y-3 p-3">
                                            <div className="h-3 w-1/3 animate-pulse rounded bg-[#eee5d0]" />
                                            <div className="h-5 w-4/5 animate-pulse rounded bg-[#eee5d0]" />
                                            <div className="h-5 w-2/5 animate-pulse rounded bg-[#eee5d0]" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : productsQuery.isError ? (
                            <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                                <h3 className="text-lg font-semibold text-zinc-950">Không thể tải danh sách sản phẩm</h3>
                                <p className="mt-2 text-sm text-zinc-600">Vui lòng kiểm tra backend và kết nối cơ sở dữ liệu, sau đó thử lại.</p>
                                <div className="mt-5">
                                    <Button variant="outline" onClick={() => productsQuery.refetch()} disabled={productsQuery.isFetching}>
                                        {productsQuery.isFetching ? 'Đang tải...' : 'Thử tải lại'}
                                    </Button>
                                </div>
                            </div>
                        ) : productList.items.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-[#dcc99b] bg-[#fffaf0]/90 p-12 text-center shadow-sm">
                                <h3 className="text-lg font-semibold text-zinc-950">
                                    Không tìm thấy
                                    sản phẩm
                                </h3>

                                <p className="mt-2 text-sm text-zinc-500">
                                    Hãy thử thay đổi
                                    bộ lọc hoặc từ
                                    khóa tìm kiếm.
                                </p>

                                <div className="mt-5">
                                    <Button
                                        variant="outline"
                                        onClick={
                                            clearFilters
                                        }
                                    >
                                        Xóa bộ lọc
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                                    {productList.items.map(
                                        (
                                            product,
                                        ) => (
                                            <CatalogProductCard
                                                key={
                                                    product.id
                                                }
                                                product={
                                                    product
                                                }
                                            />
                                        ),
                                    )}
                                </div>

                                {/* ====================================================
                                    PAGINATION
                                   ==================================================== */}

                                {productList.totalPages >
                                    1 && (
                                        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">

                                            <button
                                                type="button"
                                                disabled={
                                                    productList.page ===
                                                    1
                                                }
                                                onClick={() =>
                                                    handlePageChange(
                                                        productList.page -
                                                        1,
                                                    )
                                                }
                                                className="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-all hover:border-[#f0592a] hover:text-[#f0592a] disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                Trước
                                            </button>

                                            {Array.from(
                                                {
                                                    length:
                                                    productList.totalPages,
                                                },
                                                (
                                                    _,
                                                    index,
                                                ) => {
                                                    const page =
                                                        index +
                                                        1

                                                    const isActive =
                                                        page ===
                                                        productList.page

                                                    return (
                                                        <button
                                                            key={
                                                                page
                                                            }
                                                            type="button"
                                                            onClick={() =>
                                                                handlePageChange(
                                                                    page,
                                                                )
                                                            }
                                                            className={
                                                                isActive
                                                                    ? 'min-w-10 rounded-lg bg-[#f0592a] px-3 py-2.5 text-sm font-semibold text-white transition-all active:scale-[0.98]'
                                                                    : 'min-w-10 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium text-zinc-700 transition-all hover:border-[#f0592a] hover:text-[#f0592a] active:scale-[0.98]'
                                                            }
                                                        >
                                                            {
                                                                page
                                                            }
                                                        </button>
                                                    )
                                                },
                                            )}

                                            <button
                                                type="button"
                                                disabled={
                                                    productList.page ===
                                                    productList.totalPages
                                                }
                                                onClick={() =>
                                                    handlePageChange(
                                                        productList.page +
                                                        1,
                                                    )
                                                }
                                                className="rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-all hover:border-[#f0592a] hover:text-[#f0592a] disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                Sau
                                            </button>
                                        </div>
                                    )}
                            </>
                        )}
                    </section>
                </div>

                {/* ========================================================
                    FOOT NOTE
                   ======================================================== */}

                <div className="mt-12 rounded-2xl border border-[#e3d0a0] bg-gradient-to-r from-[#fff7dc] via-[#fffdf5] to-[#f5ebd2] p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-zinc-950">
                                Chưa tìm thấy sản phẩm
                                phù hợp?
                            </p>

                            <p className="mt-1 text-sm text-zinc-600">
                                Có thể bắt đầu một thiết
                                kế riêng trong Atelier
                                Design Studio.
                            </p>
                        </div>

                        <Link to="/design-studio">
                            <Button>
                                Thiết kế riêng
                            </Button>
                        </Link>
                    </div>
                </div>
            </Container>

            {showScrollTop && (
                <button
                    type="button"
                    aria-label="Lên đầu trang"
                    title="Lên đầu trang"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-[#f0592a] text-white shadow-[0_12px_30px_rgba(240,89,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#d94a1f] hover:shadow-[0_16px_36px_rgba(240,89,42,0.42)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f0592a]/30 active:scale-95 sm:bottom-7 sm:right-7 sm:h-14 sm:w-14"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" className="h-5 w-5" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m5 14 7-7 7 7" />
                    </svg>
                </button>
            )}
        </div>
    )
}