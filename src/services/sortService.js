// sortService.js
const sortProduct = async (sort) => {
    const objectSort = {};
    
    if (Array.isArray(sort) && sort.length === 2) {
      const [order, field] = sort;
  
      if (order === 'asc' || order === 'desc') {
        objectSort[field] = order === 'asc' ? 1 : -1;
      }
    }
  
    console.log("objectSort------->", objectSort);
    return objectSort;
  };
  
  module.exports = { sortProduct };
  