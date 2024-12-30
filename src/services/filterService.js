const filterProducts = (filters) => {
    const filterQuery = {};
    
    // Kiểm tra nếu filters là mảng
    if (Array.isArray(filters) && filters.length > 0) {
        for (let i = 0; i < filters.length; i += 2) {
            const field = filters[i]; // Trường
            const value = filters[i + 1]; // Giá trị

            if (value) {
                // Kiểm tra và xử lý từng trường hợp
                switch (field) {
                    case 'name':
                    case 'type':
                    case 'image':
                        filterQuery[field] = { $regex: value, $options: 'i' }; // Tìm kiếm không phân biệt chữ hoa chữ thường
                        break;

                    case 'price':
                        const parsedValue = parseFloat(value);
                        if (isNaN(parsedValue)) {
                            throw new Error('Invalid price value. Must be a number.');
                        }
                        filterQuery[field] = parsedValue; // Lọc theo giá chính xác
                        break;

                    default:
                        throw new Error(`Invalid filter field: ${field}`); // Trường không hợp lệ
                }
            }
        }
    }

    // Nếu không có điều kiện nào hợp lệ, trả về lỗi
    if (Object.keys(filterQuery).length === 0) {
        throw new Error('No valid filter provided.');
    }

    console.log("Filter Query------->", filterQuery);
    return filterQuery;
};

module.exports = { filterProducts };
