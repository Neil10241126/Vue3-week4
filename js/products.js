import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js";
import pagination from "./pagination.js";

const site = 'https://vue3-course-api.hexschool.io/';
const api_path = 'neil-api-test1';

let productModal = {};
let delProductModal = {};

const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false,
      page: {},
    }
  },
  methods: {
    // #1 驗證登入
    checkLogin() {
      axios.post(`${site}v2/api/user/check`)
        .then(() => {
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
          window.location = `./login.html`;
        })
    },
    // #2 取得產品資料
    getProducts(page = 1) {  // 預設參數
      const url = `${site}v2/api/${api_path}/admin/products/?page=${page}`;
      axios.get(url)
        .then((res) => {
          this.products = res.data.products;
          this.page = res.data.pagination;
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },
    // 開啟 Modal
    openModal(status, product) {
      if (status === 'create') {
        productModal.show();
        this.isNew = true;
        this.tempProduct = {
          imagesUrl: [],
        }
      } else if (status === 'edit') {
        productModal.show();
        this.isNew = false;
        this.tempProduct = { ...product };
      } else if (status === 'delete') {
        delProductModal.show();
        this.tempProduct = { ...product };
      }
    },
    // #3 新增、修改 產品資料
    updateProduct() {
      let url = `${site}v2/api/${api_path}/admin/product`;
      let methods = 'post';
      if (!this.isNew) {
        url = `${site}v2/api/${api_path}/admin/product/${this.tempProduct.id}`;
        methods = 'put';
      }
      
      axios[methods](url, {data: this.tempProduct})
        .then((res) => {
          alert(res.data.message);
          this.getProducts();
          productModal.hide();
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },
    // #4 刪除產品
    deleteProduct() {
      const url = `${site}v2/api/${api_path}/admin/product/${this.tempProduct.id}`;    
      axios.delete(url)
        .then((res) => {
          alert(res.data.message);
          this.getProducts();
          delProductModal.hide();
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },
  },
  components: {
    pagination,
  },
  mounted() {
    // 取出 token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token;

    // 驗證登入權限
    this.checkLogin();

    // Bootstrap 方法 : 綁定 Modal 物件並呼叫
    productModal = new bootstrap.Modal('#productModal');
    delProductModal = new bootstrap.Modal('#delProductModal');
  },
});

// Modal product 全域註冊
app.component('product-modal', {
  props: ['tempProduct', 'updateProduct', 'isNew'],
  template: '#product-modal-template',
});

// Modal delete 全域註冊
app.component('del-product-modal', {
  props: ['tempProduct', 'deleteProduct'],
  template: '#del-product-modal-template',
})

app.mount('#app');