import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import Container from '../../components/ui/Container'
import PageHeader from '../../components/ui/PageHeader'
import ProductCard from '../../components/ui/ProductCard'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
} from './mockProducts'

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

/*
 * ========================================================================
 * MOCK DATA
 * ========================================================================
 *
 * Chỉ dùng để demo trong giai đoạn Frontend.
 *
 * Khi API thật hoàn thành:
 * - Không xóa UI bên dưới.
 * - Không thay đổi ProductCard.
 * - Chỉ thay phần lấy productList.
 */
const getMockProductList = ({
                              filters,
                              sortBy,
                              page,
                            }) => {
  let products = [...MOCK_PRODUCTS]

  // ------------------------------------------------------------
  // FILTER
  // ------------------------------------------------------------

  if (filters.categoryId) {
    products = products.filter(
        (product) =>
            String(product.categoryId) ===
            String(filters.categoryId),
    )
  }

  if (filters.color) {
    products = products.filter((product) =>
        product.colors?.includes(filters.color),
    )
  }

  if (filters.size) {
    products = products.filter((product) =>
        product.sizes?.includes(filters.size),
    )
  }

  if (filters.minPrice !== '') {
    products = products.filter(
        (product) =>
            product.price >= Number(filters.minPrice),
    )
  }

  if (filters.maxPrice !== '') {
    products = products.filter(
        (product) =>
            product.price <= Number(filters.maxPrice),
    )
  }

  // ------------------------------------------------------------
  // SORT
  // ------------------------------------------------------------

  switch (sortBy) {
    case 'newest':
      products.sort(
          (a, b) =>
              new Date(b.createdAt) -
              new Date(a.createdAt),
      )
      break

    case 'best-selling':
      products.sort(
          (a, b) =>
              b.soldCount - a.soldCount,
      )
      break

    case 'most-viewed':
      products.sort(
          (a, b) =>
              b.viewCount - a.viewCount,
      )
      break

    case 'price-asc':
      products.sort(
          (a, b) => a.price - b.price,
      )
      break

    case 'price-desc':
      products.sort(
          (a, b) => b.price - a.price,
      )
      break

    case 'recommended':
    default:
      /*
       * Demo recommendation:
       * dùng soldCount + viewCount làm điểm đơn giản.
       *
       * Sau này recommendation có thể được thay
       * hoàn toàn bằng dữ liệu từ Backend.
       */
      products.sort(
          (a, b) =>
              b.soldCount + b.viewCount -
              (a.soldCount + a.viewCount),
      )
      break
  }

  // ------------------------------------------------------------
  // PAGINATION
  // ------------------------------------------------------------

  const totalItems = products.length

  const totalPages = Math.max(
      1,
      Math.ceil(
          totalItems / PRODUCTS_PER_PAGE,
      ),
  )

  /*
   * Nếu filter/sort làm số trang giảm,
   * đảm bảo page không vượt quá totalPages.
   */
  const safePage = Math.min(
      Math.max(page, 1),
      totalPages,
  )

  const startIndex =
      (safePage - 1) * PRODUCTS_PER_PAGE

  const endIndex =
      startIndex + PRODUCTS_PER_PAGE

  const items = products.slice(
      startIndex,
      endIndex,
  )

  return {
    items,
    page: safePage,
    pageSize: PRODUCTS_PER_PAGE,
    totalItems,
    totalPages,
  }
}

export default function Catalog() {
  const [searchParams, setSearchParams] =
      useSearchParams()

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
      ...new Set(
          MOCK_PRODUCTS.flatMap(
              (product) =>
                  product.colors || [],
          ),
      ),
    ]

    const sizes = [
      ...new Set(
          MOCK_PRODUCTS.flatMap(
              (product) =>
                  product.sizes || [],
          ),
      ),
    ]

    const prices = MOCK_PRODUCTS.map(
        (product) => product.price,
    )

    return {
      colors,
      sizes,
      minPrice:
          prices.length > 0
              ? Math.min(...prices)
              : 0,
      maxPrice:
          prices.length > 0
              ? Math.max(...prices)
              : 0,
    }
  }, [])

  /*
   * ====================================================================
   * SEARCH
   * ====================================================================
   *
   * Search đang được xử lý ở Frontend để demo.
   *
   * Khi API thật hoàn thành, có thể chuyển "search"
   * thành query param gửi lên Backend.
   */

  const searchedProducts = useMemo(() => {
    const keyword =
        searchText.trim().toLowerCase()

    if (!keyword) {
      return MOCK_PRODUCTS
    }

    return MOCK_PRODUCTS.filter(
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
  }, [searchText])

  /*
   * ====================================================================
   * MOCK PRODUCT LIST
   * ====================================================================
   *
   * Normalise dữ liệu về một cấu trúc mà UI sẽ dùng.
   *
   * Đây là phần quan trọng để sau này API thật có thể
   * thay thế mà không phải sửa ProductCard / Pagination.
   */

  const productList = useMemo(() => {
    const originalProducts =
        MOCK_PRODUCTS

    /*
     * Tạm thay MOCK_PRODUCTS bằng kết quả search.
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

  useEffect(() => {
    setCurrentPage(1)
  }, [
    searchText,
    filters.categoryId,
    filters.minPrice,
    filters.maxPrice,
    filters.color,
    filters.size,
    sortBy,
  ])

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
   * ====================================================================
   * API THẬT - GIỮ LẠI ĐỂ MỞ SAU
   * ====================================================================
   *
   * Khi Backend hoàn thiện, phần mock ở trên có thể bỏ/thay thế.
   *
   * Dự kiến:
   *
   * import { useQuery } from '@tanstack/react-query'
   * import { productApi } from '../../api/productApi'
   *
   * const productQuery = useQuery({
   *     queryKey: [
   *         'products',
   *         {
   *             page: currentPage,
   *             pageSize: PRODUCTS_PER_PAGE,
   *             search: searchText,
   *             ...filters,
   *             sort: sortBy,
   *         },
   *     ],
   *     queryFn: () =>
   *         productApi.getAll({
   *             page: currentPage,
   *             pageSize: PRODUCTS_PER_PAGE,
   *             search: searchText,
   *             ...filters,
   *             sort: sortBy,
   *         }),
   * })
   *
   * Khi đó:
   *
   * const productList = productQuery.data
   *
   * và giữ nguyên UI phía dưới.
   */

  /*
   * ====================================================================
   * RENDER
   * ====================================================================
   */

  return (
      <div className="bg-white">
        <Container className="py-8 sm:py-10 lg:py-12">

          <PageHeader
              title="Khám phá sản phẩm"
              description="Tìm kiếm và khám phá những sản phẩm phù hợp với phong cách của bạn."
          />

          {/* ========================================================
                    SEARCH + SORT
                   ======================================================== */}

          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

            <div className="w-full lg:max-w-xl">
              <label
                  htmlFor="catalog-search"
                  className="mb-2 block text-sm font-medium text-zinc-900"
              >
                Tìm kiếm
              </label>

              <Input
                  id="catalog-search"
                  type="text"
                  value={searchText}
                  placeholder="Tìm tên sản phẩm..."
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
                  className="mb-2 block text-sm font-medium text-zinc-900"
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
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-all focus:border-[#f0592a] focus:ring-4 focus:ring-[#f0592a]/10"
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

          {/* ========================================================
                    FILTER + PRODUCT LIST
                   ======================================================== */}

          <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">

            {/* ====================================================
                        SIDEBAR
                       ==================================================== */}

            <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-zinc-950">
                  Bộ lọc
                </h2>

                {hasFilters && (
                    <button
                        type="button"
                        onClick={
                          clearFilters
                        }
                        className="text-sm font-medium text-[#f0592a] hover:underline"
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
                    className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition-all focus:border-[#f0592a] focus:ring-4 focus:ring-[#f0592a]/10"
                >
                  <option value="">
                    Tất cả
                  </option>

                  {MOCK_CATEGORIES.map(
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
                    className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition-all focus:border-[#f0592a] focus:ring-4 focus:ring-[#f0592a]/10"
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
                    className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition-all focus:border-[#f0592a] focus:ring-4 focus:ring-[#f0592a]/10"
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
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-zinc-500">
                  {productList.totalItems ===
                  0
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

                <p className="text-sm text-zinc-500">
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

              {productList.items
                  .length ===
              0 ? (
                  <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
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
                              <ProductCard
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

          <div className="mt-12 rounded-2xl border border-[#e8dca6] bg-[#fefccf] p-6">
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
      </div>
  )
}