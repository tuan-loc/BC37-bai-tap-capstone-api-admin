let productList = [];
axios;

const getProductList = async () => {
  try {
    const res = await axios({
      url: "https://633c214074afaef1640280a4.mockapi.io/products-data",
      method: "GET",
    });
    productList = mapData(res.data);
    renderProducts(productList);
  } catch (error) {
    console.log(error);
  }
};

const addProduct = async () => {
  let id = document.getElementById("MaSP").value;
  let name = document.getElementById("TenSP").value;
  let price = document.getElementById("GiaSP").value;
  let screen = document.getElementById("ManHinh").value;
  let backCamera = document.getElementById("CameraSau").value;
  let frontCamera = document.getElementById("CameraTruoc").value;
  let img = document.getElementById("HinhSP").value;
  let desc = document.getElementById("MoTa").value;
  let type = document.getElementById("PhanLoai").value;

  let isFormValid = validateForm(
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type
  );
  if (!isFormValid) return;

  let newProduct = new Products(
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type
  );

  try {
    await axios({
      url: "https://633c214074afaef1640280a4.mockapi.io/products-data",
      method: "POST",
      data: newProduct,
    });
    getProductList();
    document.getElementsByClassName("close")[0].click();
  } catch (error) {
    console.log(error);
  }
};

const mapData = (data) => {
  let result = [];

  data.forEach((product) => {
    const {
      id,
      name,
      price,
      screen,
      backCamera,
      frontCamera,
      img,
      desc,
      type,
    } = product;

    result.push(
      new Products(
        id,
        name,
        price,
        screen,
        backCamera,
        frontCamera,
        img,
        desc,
        type
      )
    );
  });

  return result;
};

const renderProducts = (data) => {
  let productHTML = "";
  for (let i in data) {
    productHTML += data[i].render(+i + 1);
  }

  document.getElementById("tblDanhSachSP").innerHTML = productHTML;
};

const deleteProduct = async (productId) => {
  try {
    await axios({
      url: `https://633c214074afaef1640280a4.mockapi.io/products-data/${productId}`,
      method: "DELETE",
    });
    getProductList();
  } catch (error) {
    console.log(error);
  }
};

const searchProducts = () => {
  let keyword = document.getElementById("inputTK").value.toLowerCase().trim();
  let result = productList.filter(
    (item) => item.id === keyword || item.name.toLowerCase().includes(keyword)
  );

  renderProducts(result);
};

const getUpdateProduct = async (productId) => {
  try {
    let res = await axios({
      url: `https://633c214074afaef1640280a4.mockapi.io/products-data/${productId}`,
      method: "GET",
    });

    let product = res.data;

    document.getElementById("MaSP").value = product.id;
    document.getElementById("TenSP").value = product.name;
    document.getElementById("GiaSP").value = product.price;
    document.getElementById("ManHinh").value = product.screen;
    document.getElementById("CameraSau").value = product.backCamera;
    document.getElementById("CameraTruoc").value = product.frontCamera;
    document.getElementById("HinhSP").value = product.img;
    document.getElementById("MoTa").value = product.desc;
    document.getElementById("PhanLoai").value = product.type;

    document.getElementsByClassName("modal-title")[0].innerHTML =
      "Cập nhật sản phẩm";
    document.getElementById("addProduct").style.display = "none";
    document.getElementById("updateProduct").style.display = "inline-block";
    document.getElementById("MaSP").disabled = true;
  } catch (error) {
    console.log(error);
  }
};

const updateProduct = async () => {
  let id = document.getElementById("MaSP").value;
  let name = document.getElementById("TenSP").value;
  let price = document.getElementById("GiaSP").value;
  let screen = document.getElementById("ManHinh").value;
  let backCamera = document.getElementById("CameraSau").value;
  let frontCamera = document.getElementById("CameraTruoc").value;
  let img = document.getElementById("HinhSP").value;
  let desc = document.getElementById("MoTa").value;
  let type = document.getElementById("PhanLoai").value;

  let newProduct = new Products(
    id,
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type
  );

  try {
    await axios({
      url: `https://633c214074afaef1640280a4.mockapi.io/products-data/${id}`,
      method: "PUT",
      data: newProduct,
    });

    getProductList();
    document.getElementsByClassName("modal-title")[0].innerHTML =
      "Thêm sản phẩm";
    document.getElementById("addProduct").style.display = "inline-block";
    document.getElementById("updateProduct").style.display = "none";
    document.getElementById("MaSP").disabled = false;
    document.getElementById("form-products").reset();
    document.getElementsByClassName("close")[0].click();
  } catch (error) {
    console.log(error);
  }
};

const validateForm = (
  id,
  name,
  price,
  screen,
  backCamera,
  frontCamera,
  img,
  desc,
  type
) => {
  let isValid = true;

  isValid &=
    required(id, "spanMaSP") &&
    length(id, "spanMaSP", 6, 8) &&
    lettersNumbers(id, "spanMaSP");
  isValid &=
    required(name, "spanTenSP") && lettersNumbersWhiteSpace(name, "spanTenSP");
  isValid &= required(price, "spanGiaSP") && number(price, "spanGiaSP");
  isValid &= required(screen, "spanManHinh");
  isValid &= required(backCamera, "spanCameraSau");
  isValid &= required(frontCamera, "spanCameraTruoc");
  isValid &= required(img, "spanHinhSP");
  isValid &= required(desc, "spanMoTa");
  isValid &= required(type, "spanPhanLoai") && letters(type, "spanPhanLoai");

  return isValid;
};

const required = (value, spanId) => {
  if (value.length === 0) {
    document.getElementById(spanId).innerHTML = "*Trường này bắt buộc nhập!";
    document.getElementById(spanId).style.display = "inline-block";
    return false;
  }

  document.getElementById(spanId).innerHTML = "";
  document.getElementById(spanId).style.display = "none";
  return true;
};

const length = (value, spanId, min, max) => {
  if (value.length < min || value.length > max) {
    document.getElementById(
      spanId
    ).innerHTML = `*Độ dài phải từ ${min} đến ${max} kí tự`;
    document.getElementById(spanId).style.display = "inline-block";
    return false;
  }

  document.getElementById(spanId).innerHTML = "";
  document.getElementById(spanId).style.display = "none";
  return true;
};

const lettersNumbers = (value, spanId) => {
  var pattern = /^[0-9a-zA-Z]+$/;
  if (pattern.test(value)) {
    document.getElementById(spanId).innerHTML = "";
    document.getElementById(spanId).style.display = "none";
    return true;
  }

  document.getElementById(spanId).innerHTML =
    "*Chỉ chấp nhận kí tự từ a đến z và từ 0 đến 9!";
  document.getElementById(spanId).style.display = "inline-block";
  return false;
};

const letters = (value, spanId) => {
  var pattern = /^[A-Za-z]+$/;
  if (pattern.test(value)) {
    document.getElementById(spanId).innerHTML = "";
    document.getElementById(spanId).style.display = "none";
    return true;
  }

  document.getElementById(spanId).innerHTML =
    "*Chỉ chấp nhận kí tự từ a đến z và từ 0 đến 9!";
  document.getElementById(spanId).style.display = "inline-block";
  return false;
};

const lettersNumbersWhiteSpace = (value, spanId) => {
  var pattern = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/;
  if (pattern.test(value)) {
    document.getElementById(spanId).innerHTML = "";
    document.getElementById(spanId).style.display = "none";
    return true;
  }

  document.getElementById(spanId).innerHTML =
    "*Chỉ chấp nhận kí tự từ a đến z và từ 0 đến 9!";
  document.getElementById(spanId).style.display = "inline-block";
  return false;
};

const number = (value, spanId) => {
  var pattern = /^[0-9]+$/;
  if (pattern.test(value)) {
    document.getElementById(spanId).innerHTML = "";
    document.getElementById(spanId).style.display = "none";
    return true;
  }

  document.getElementById(spanId).innerHTML =
    "*Chỉ chấp nhận kí tự từ 0 đến 9!";
  document.getElementById(spanId).style.display = "inline-block";
  return false;
};

const resetButtonAdd = () => {
  document.getElementsByClassName("modal-title")[0].innerHTML = "Thêm sản phẩm";
  document.getElementById("MaSP").disabled = false;
  document.getElementById("form-products").reset();
  document.getElementById("addProduct").style.display = "inline-block";
  document.getElementById("updateProduct").style.display = "none";
};

window.onload = () => {
  getProductList();
  document.getElementById("addProduct").addEventListener("click", addProduct);
  document
    .getElementById("updateProduct")
    .addEventListener("click", updateProduct);
  document
    .getElementById("btnThemSP")
    .addEventListener("click", resetButtonAdd);
};
