import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItem, addSelectedOption, removeSelectedOption } from "../../store/cart/cart";
import * as style from "./TopStyle";
import am7 from "../../data/product/7am.json";
import am10 from "../../data/product/10am.json";
import pm1 from "../../data/product/1pm.json";
import pm3 from "../../data/product/3pm.json";
import pm6 from "../../data/product/6pm.json";
import pm9 from "../../data/product/9pm.json";
import pm11 from "../../data/product/11pm.json";
import TryEat from "../../data/product/TryEat.json";

function Top() {
  const { id } = useParams();
  const dummy = [
    ...am7,
    ...am10,
    ...pm1,
    ...pm3,
    ...pm6,
    ...pm9,
    ...pm11,
    ...TryEat,
  ];
  const product = dummy.find((item) => item.id === parseInt(id));

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [optionQuantities, setOptionQuantities] = useState([]);

  // 선택한 옵션 데이터 만들기
  const handleProductSelect = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === "") {
      // 옵션 선택이 해제된 경우 선택목록에서 제거
      setSelectedOptions(
        selectedOptions.filter((option) => option !== selectedValue)
      );
      dispatch(removeSelectedOption(selectedValue));

      const updatedOptionQuantities = optionQuantities.filter(
        (entry) => entry.option !== selectedValue
      );
      setOptionQuantities(updatedOptionQuantities);
    } else {
      // 이미 선택한 옵션이 아니면 추가
      if (!selectedOptions.includes(selectedValue)) {
        setSelectedOptions([...selectedOptions, selectedValue]);
        dispatch(addSelectedOption(selectedValue));

        // 옵션 수량을 객체로 만들어 배열에 추가
        const optionQuantityEntry = {
          option: selectedValue,
          quantity:
            optionQuantities.find((entry) => entry.option === selectedValue)
              ?.quantity || 1,
        };
        setOptionQuantities([...optionQuantities, optionQuantityEntry]);
      } else {
        alert("이미 선택한 옵션입니다.");
      }
    }
  };

  // 옵션별 삭제 기능
  const handleProductDelete = (selectedOption) => {
    setSelectedOptions(
      selectedOptions.filter((option) => option !== selectedOption)
    );
    const updatedOptionQuantities = optionQuantities.filter(
      (entry) => entry.option !== selectedOption
    );
    setOptionQuantities(updatedOptionQuantities);
  };

  // 옵션별 수량 변경
  const handleQuantityChange = (event, selectedOption) => {
    const newQuantity = parseInt(event.target.value);
    const updatedOptionQuantities = optionQuantities.map((entry) => {
      if (entry.option === selectedOption) {
        entry.quantity = newQuantity;
      }
      return entry;
    });
    setOptionQuantities(updatedOptionQuantities);
  };

  // 옵션별 원래 가격
  function getPriceForOption(product, optionName) {
    const selectedOption = product?.top[0].select.find(
      (option) => option.option === optionName
    );
    if (selectedOption) {
      const priceWithoutCommas = selectedOption.price.replace(/,/g, "");
      return parseInt(priceWithoutCommas);
    }

    return 0;
  }
  // 옵션별 원래 가격 * 수량
  const optionTotalPrice = (option) => {
    const optionQuantityEntry = optionQuantities.find(
      (entry) => entry.option === option
    );
    if (optionQuantityEntry) {
      const optionPrice = getPriceForOption(product, option);
      return optionPrice * optionQuantityEntry.quantity;
    }
    return 0;
  };

  // 옵션별 할인 가격을 저장하는 객체
  const optionPrices = {};

  product.top[0].select.forEach((option) => {
    const priceWithoutWon = option.sale_price || option.price;
    const optionPrice = parseInt(priceWithoutWon.replace(/,/g, ""));
    optionPrices[option.option] = optionPrice;
  });
  // 옵션별 할인 가격 * 수량
  const calculateSubTotal = (option) => {
    const optionQuantityEntry = optionQuantities.find(
      (entry) => entry.option === option
    );
    if (optionQuantityEntry) {
      const optionPrice = optionPrices[option];
      return optionPrice * optionQuantityEntry.quantity;
    }
    return 0;
  };

  // 총 수량
  const totalQuantity = optionQuantities.reduce(
    (total, entry) => total + entry.quantity,
    0
  );

  // 총 가격
  const totalPrice = selectedOptions.reduce((total, option) => {
    const subTotal = calculateSubTotal(option);
    return total + subTotal;
  }, 0);

  let dispatch = useDispatch();

  const item = useSelector((state) => state.detail); // Redux 스토어에서 제품 세부 정보 가져오기

  // 장바구니로 보내기
  function SendToCart(item) {
    const cartItems = selectedOptions.map((option) => {
      const optionQuantityEntry = optionQuantities.find(
        (entry) => entry.option === option
      );
      const quantity = optionQuantityEntry ? optionQuantityEntry.quantity : 0;

      // option을 찾아서 해당 option의 price 및 sale_price에 접근
      const selectedProduct = product.top[0].select.find(
        (selectOption) => selectOption.option === option
      );

      const price = selectedProduct ? selectedProduct.price : "";
      const salePrice = selectedProduct ? selectedProduct.sale_price : "";

      const subTotal = calculateSubTotal(option); // 옵션별 총 금액

      return {
        id: product.id,
        img: product.image,
        name: product.name,
        price: price,
        sale_price: salePrice,
        option: option,
        quantity: quantity, // 수량정보 수정 필요
        subTotal: subTotal,
        options: selectedOptions, // 옵션정보 수정 필요
      };
    });

    cartItems.forEach((cartItems) => {
      dispatch(addItem(cartItems));
      console.log(cartItems);
    });
  }

  const [CartAlert, setCartAlert] = useState(false);
  function activeCartAlert() {
    setCartAlert(!CartAlert);
  }

  const movePage = useNavigate();
  function goCart() {
    movePage("/Cart");
  }

  console.log("옵션", selectedOptions);
  console.log("선택옵션", optionQuantities);

  return (
    <>
      <style.HeadCategory>
        <ol>
          <li>
            <Link to="">홈</Link>
          </li>
          <li>
            <Link to="">다노절 이벤트</Link>
          </li>
        </ol>
      </style.HeadCategory>
      <style.SubTop>
        <style.DetailArea>
          <style.ImgArea>
            <div className="prod_img">
              <Link to="">
                <img src={product.top[0].product_imgB} alt="" />
              </Link>
            </div>
            <div className="list_img">
              <ul>
                <li>
                  <img src={product.top[0].product_imgS} alt="" />
                </li>
              </ul>
            </div>
          </style.ImgArea>
          <style.InfoArea {...(product.top[0].discount ? { sale: true } : {})}>
            <div className="heading_area">
              <h1>{product.top[0].header}</h1>
            </div>
            <table className="sale_info">
              <tbody>
                <tr>
                  <th>
                    <span>상품요약정보</span>
                  </th>
                  <td>
                    <span>{product.top[0].summary_info}</span>
                  </td>
                </tr>
                <tr>
                  <th>
                    <span className="price">판매가</span>
                  </th>
                  <td>
                    <span className="price">
                      <strong>{product.top[0].price}</strong>
                    </span>
                  </td>
                </tr>
                <tr className="sale">
                  <th>
                    <span className="sale_price">할인판매가</span>
                  </th>
                  <td>
                    <span className="sale_price">
                      {product.top[0].sale_price}
                      <span className="percent">{product.top[0].discount}</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>
                    <span style={{ fontSize: "1.2rem", color: "#000" }}>
                      구성
                    </span>
                  </th>
                  <td>
                    <span style={{ fontSize: "1.2rem", color: "#000" }}>
                      {product.top[0].composition}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>
                    <span>배송방법</span>
                  </th>
                  <td>
                    <span>택배</span>
                  </td>
                </tr>
                <tr>
                  <th>
                    <span>배송비</span>
                  </th>
                  <td>
                    <span>
                      <strong>3,500원</strong> (50,000원 이상 구매 시 무료)
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="option">
              <tbody>
                <tr>
                  <th>옵션</th>
                  <td>
                    <select name="" id="" onChange={handleProductSelect}>
                      <option value="">- [필수] 옵션을 선택해 주세요 -</option>
                      <option value="">-------------------</option>
                      {product.top[0].select.map((item, index) => (
                        <option key={index}>{item.option}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="guide_area">
              <p className="info ">(최소주문수량 1개 이상)</p>
            </div>
            {selectedOptions.map((selectedOption, index) => (
              <div className="total_products" key={index}>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <p className="product">
                          {product.top[0].header}
                          <br></br> - <span>{selectedOption}</span>
                        </p>
                      </td>
                      <td>
                        <span className="quantity">
                          <input
                            type="number"
                            value={
                              optionQuantities.find(
                                (entry) => entry.option === selectedOption
                              )?.quantity || 0
                            }
                            onChange={(e) =>
                              handleQuantityChange(e, selectedOption)
                            }
                          />
                          <button
                            className="up"
                            onClick={() =>
                              handleQuantityChange(
                                {
                                  target: {
                                    value:
                                      (optionQuantities.find(
                                        (entry) =>
                                          entry.option === selectedOption
                                      )?.quantity || 0) + 1,
                                  },
                                },
                                selectedOption
                              )
                            }
                          >
                            +
                          </button>
                          <button
                            className="down"
                            onClick={() =>
                              handleQuantityChange(
                                {
                                  target: {
                                    value: Math.max(
                                      (optionQuantities.find(
                                        (entry) =>
                                          entry.option === selectedOption
                                      )?.quantity || 0) - 1,
                                      1
                                    ),
                                  },
                                },
                                selectedOption
                              )
                            }
                          >
                            -
                          </button>
                        </span>
                        <button
                          className="delete"
                          onClick={() => handleProductDelete(selectedOption)}
                        >
                          <img src="/img/icon/ico_product_delete.svg" alt="" />
                        </button>
                      </td>
                      <td>
                        <span className="right">
                          <span>{calculateSubTotal(selectedOption)} 원</span>
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
            <div className="total_price">
              <strong className="title">
                TOTAL <span className="qty">(QUANTITY)</span>
              </strong>
              <span className="total">
                <strong>
                  <em>{totalPrice}원</em>
                </strong>{" "}
                ({totalQuantity}개)
              </span>
            </div>
            <div className="delivery_info">
              <div className="title">배송정보</div>
              <div className="info_value">
                <p className="type">다노배송(새벽/택배)</p>
                <p className="value">
                  새벽배송 : <span className="highlight">오후 5시</span>까지
                  결제 시 <span className="highlight">내일 오전 7시 전</span>{" "}
                  도착
                </p>
                <p className="value">
                  택배배송 : <span className="highlight">오후 5시</span>까지
                  결제 시 <span className="highlight">오늘</span> 출고
                </p>
              </div>
            </div>
            <div className="action_btn_wrap">
              <div className="action_btn">
                <button
                  className="btn_submit sizeL"
                  onClick={() => {
                    goCart();
                    SendToCart();
                  }}
                >
                  구매하기
                </button>
                <button
                  className="btn_normal sizeL action_cart"
                  onClick={() => {
                    SendToCart(item);
                    activeCartAlert();
                  }}
                >
                  장바구니
                </button>
                <button
                  className="btn_normal sizeL action_wish"
                  onClick={() => SendToCart(item)} // 테스트
                >
                  관심상품
                </button>
              </div>
              <style.NaverButton>
                <div className="npay_store">
                  <div className="npay_btn_box">
                    <div className="npay_btn">
                      <div className="npay_txt">
                        <span className="npay_blind"></span>
                      </div>
                      <table>
                        <tbody>
                          <tr>
                            <td>
                              <a href="#none" className="npay_btn_pay">
                                -
                              </a>
                            </td>
                            <td>
                              <a href="#none" className="npay_btn_zzim">
                                -
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="npay_event">
                      <p>
                        <strong>현장결제</strong>
                        <a href="#none">결제할 때 마다, 월 50번 포인트 뽑기!</a>
                      </p>
                      <a href="#none" className="npay_more prev">
                        -
                      </a>
                      <a href="#none" className="npay_more next">
                        -
                      </a>
                    </div>
                  </div>
                </div>
              </style.NaverButton>
            </div>
          </style.InfoArea>
        </style.DetailArea>
      </style.SubTop>
      {CartAlert && (
        <style.AlertWrap>
          <div className="alert">
            <div className="content">
              <p>
                장바구니에 상품이<br></br>정상적으로 담겼습니다.
              </p>
            </div>
            <div className="submit_btn">
              <button className="continue" onClick={activeCartAlert}>
                계속 쇼핑하기
              </button>
              <Link to="/cart" className="cart">
                장바구니 이동
              </Link>
            </div>
            <button className="close_btn" onClick={activeCartAlert}>
              닫기
            </button>
          </div>
        </style.AlertWrap>
      )}
    </>
  );
}

export default Top;
