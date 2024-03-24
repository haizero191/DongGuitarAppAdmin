import React, { useEffect, useState } from "react";
import "./Order_M.scss";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Modal from "../Modal/Modal";
import OrderAPI from "../../apis/Order/OrderAPI";
import Loading from "../Loading/Loading";
import O_ConfirmForm from "../../utils/OrderAction/O_ConfirmForm/O_ConfirmForm";
import moment from "moment";

const Order_M = ({ onLoad }) => {
  const [isModalActive, setIsModalActive] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [orderStatusSelect, setOrderStatusSelect] = useState({
    status: "Open",
    name: "Đơn hàng mới",
  });
  const [orderList, setOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [orderSelected, setOrderSelected] = useState({});
  const [isSearch, setIsSearch] = useState(false);

  // Variables for filter
  const [orderSearchList, setOrderSearchList] = useState([]);
  const [filter, setFilter] = useState({
    type: "code",
    search: "",
    start: "",
    end: "",
  });

  // Statistics state data
  const [review, setReview] = useState({
    reviewed: 0,
    notReviewYet: 0,
  });

  const [sum, setSum] = useState({
    detail: 0,
    total: 0,
  });

  const orderStatusList = [
    {
      status: "Open",
      name: "Đơn hàng mới",
    },
    {
      status: "Confirmed",
      name: "Đã xác nhận",
    },
    {
      status: "Paid",
      name: "Đã thanh toán",
    },
    {
      status: "Shipping",
      name: "Đang giao",
    },
    {
      status: "Delivered",
      name: "Đã giao hàng",
    },
    {
      status: "Finished",
      name: "Đã hoàn thành",
    },
    {
      status: "Canceled",
      name: "Đã hủy",
    },
  ];




  useEffect(() => {
    loadData();
  }, [orderStatusSelect]);

  // Xửa lí modal
  const handleModalAction = (data) => {
    switch (data.status) {
      case "close":
        setIsModalActive(false);
        break;
      default:
        break;
    }
  };

  // Handle select order
  const onSelectOrder = async (order) => {
    console.log(order);
    await updateReviewOrder(order);
    setIsModalActive(true);
    setModalAction("O_SELECT_CONFIRM");
    setModalTitle("ORDER INFORMATION");
    setOrderSelected(order);
    getTotalOrderWithReview(orderList);
  };


  // Update review for order
  const updateReviewOrder = async (order) => {
    var updateOrder = order;
    updateOrder.IsReview = true;
    return await OrderAPI.update(updateOrder._id, updateOrder);
  };

  // Handle Order status tabs change
  const handleTabChange = (index) => {
    if (index < 7) setOrderStatusSelect(orderStatusList[index]);
    else {
      setIsSearch((isSearch) => !isSearch);
    }
  };

  // Lấy tổng số đơn hàng đã xem và chưa xem theo status đã chọn
  const getTotalOrderWithReview = (data) => {
    if (data) {
      var reviewedArr = data.filter((order) => {
        return order.IsReview;
      });
      setReview((review) => ({
        ...review,
        reviewed: reviewedArr.length,
        notReviewYet: data.length - reviewedArr.length,
      }));
    }
  };

  // Initial data loader
  const loadData = () => {
    // Lấy danh sách đơn hàng theo status đã chọn
    const getOrdersWithStatus = async () => {
      setIsLoading(true);
      var Get_Order_With_Status_Result = await OrderAPI.get({
        status: orderStatusSelect.status,
      });
      if (Get_Order_With_Status_Result.success) {
        setTimeout(() => {
          setIsLoading(false);
          setOrderList(Get_Order_With_Status_Result.data);
          getTotalOrderWithReview(Get_Order_With_Status_Result.data);
        }, 250);
      } else {
        setTimeout(() => {
          setIsLoading(false);
          setOrderList([]);
        }, 250);
      }
    };

    // Lấy tổng số đơn hàng
    const getTotalOrder = async () => {
      var Get_Total_Order_Result = await OrderAPI.count();
      if (Get_Total_Order_Result.success)
        setSum((sum) => ({
          ...sum,
          total: Get_Total_Order_Result.data,
        }));
    };

    // Lấy tổng số đơn hàng theo status đã chọn
    const getTotalOrderWithStatus = async () => {
      var Get_Total_Order_Result = await OrderAPI.count(
        "Status",
        orderStatusSelect.status
      );
      if (Get_Total_Order_Result.success)
        setSum((sum) => ({
          ...sum,
          detail: Get_Total_Order_Result.data,
        }));
    };

    getTotalOrder();
    getTotalOrderWithStatus();
    getOrdersWithStatus();
  };

  // Trigger Form actions
  const onFormAction = (data) => {
    if (data.status === "FORM_FINISHED") {
      setIsModalActive(false);
    }
    if (data.status === "FORM_CANCEL") {
      setIsModalActive(false);
    }

    loadData();
  };

  // Format date time
  const dateTimeFormatter = (date) => {
    const formattedDate = moment(date).format("DD-MM-YYYY \n HH:mm:ss");
    return formattedDate;
  };

  const onSelectTypeSearch = (type) => {
    setFilter({ ...filter, type: type });
  };

  const onSearchOrder = async () => {
    setIsLoading(true);
    const Search_Order_Result = await OrderAPI.search({
      code: filter.type === "code" ? filter.search : null,
      phone: filter.type === "phone" ? filter.search : null,
    });

    if (Search_Order_Result.success) {
      setTimeout(() => {
        setIsLoading(false);
        setOrderSearchList(Search_Order_Result.data);
      }, 500);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setOrderSearchList(Search_Order_Result.data);
      }, 500);
    }
  };

  const onSearchChange = (event) => {
    setFilter({ ...filter, search: event.target.value });
  };

  

  return (
    <div className="Order_M">
      <div className={isSearch ? "OM-left OM-left-active" : "OM-left"}>
        {/* Quản lí đơn hàng */}
        <div className="OM-manage">
          <div className="OM-title">
            <div className="title">Quản lí đơn hàng</div>
          </div>
          <Tabs onSelect={(index) => handleTabChange(index)}>
            <div className="OM-main">
              <div className="order-status-tabs">
                <div className="tabs-container">
                  <TabList>
                    {orderStatusList.map((os, index) => {
                      return (
                        <Tab key={"status-tab-" + index} disabled={isSearch}>
                          {os.name}
                        </Tab>
                      );
                    })}

                    <Tab className={"react-tabs__tab search-tab"} name="search">
                      <span>{isSearch ? "Đóng" : "Bộ lọc"}</span>
                      {isSearch ? (
                        <i class="bi bi-x-lg"></i>
                      ) : (
                        <i class="bi bi-search"></i>
                      )}
                    </Tab>
                  </TabList>
                </div>
              </div>
              <div className="order-status-container">
                {orderStatusList.map((os) => {
                  return (
                    <TabPanel key={"tab-order-content" + os.status}>
                      <div className="order-list">
                        <div className="order-list-header">
                          <div className="order-h-item order-h-empty"></div>
                          <div className="order-h-item order-h-code">
                            Mã đơn hàng
                          </div>
                          <div className="order-h-item order-h-product">
                            Tên sản phẩm
                          </div>
                          <div className="order-h-item order-h-customer">
                            Tên khách hàng
                          </div>
                          <div className="order-h-item order-h-time">
                            Thời gian
                          </div>
                        </div>
                        <div className="order-list-body">
                          <div className="order-list-inner">
                            {isLoading ? (
                              <Loading isLoading={isLoading}></Loading>
                            ) : orderList.length === 0 ? (
                              <div className="order-status-empty">
                                Chưa có đơn hàng nào
                              </div>
                            ) : (
                              orderList.map((order) => {
                                return (
                                  <div
                                    className={
                                      "order-item " +
                                      (!order.IsReview ? "new-order-item" : "")
                                    }
                                    onClick={() => onSelectOrder(order)}
                                    key={"order-" + order._id}
                                  >
                                    <div className="order-h-item order-empty"></div>
                                    <div className="order-code">
                                      {order.Code}
                                    </div>
                                    <div className="order-product">
                                      {order.ProductName ? order.ProductName : "N/a"}
                                    </div>
                                    <div className="order-customer">
                                      {order.Fullname}
                                    </div>
                                    <div className="order-time">
                                      {dateTimeFormatter(order.CreatedAt)}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>
                    </TabPanel>
                  );
                })}

                <TabPanel>
                  {isSearch && (
                    <div className="order-list">
                      <div className="order-list-header">
                        <div className="order-h-item order-h-empty"></div>
                        <div className="order-h-item order-h-code">
                          Mã đơn hàng
                        </div>
                        <div className="order-h-item order-h-product">
                          Tên sản phẩm
                        </div>
                        <div className="order-h-item order-h-customer">
                          Tên khách hàng
                        </div>
                        <div className="order-h-item order-h-time">
                          Thời gian
                        </div>
                      </div>
                      <div className="order-list-body">
                        <div className="order-list-inner">
                          {isLoading ? (
                            <Loading isLoading={isLoading}></Loading>
                          ) : orderSearchList.length === 0 ? (
                            <div className="order-status-empty">
                              Không tìm thấy đơn hàng
                            </div>
                          ) : (
                            orderSearchList.map((order) => {
                              return (
                                <div
                                  className={
                                    "order-item " +
                                    (!order.IsReview ? "new-order-item" : "")
                                  }
                                  onClick={() => onSelectOrder(order)}
                                  key={"order-" + order._id}
                                >
                                  <div className="order-h-item order-empty"></div>
                                  <div className="order-code">{order.Code}</div>
                                  <div className="order-product">
                                    {order.Product.Name}
                                  </div>
                                  <div className="order-customer">
                                    {order.Fullname}
                                  </div>
                                  <div className="order-time">
                                    {dateTimeFormatter(order.CreatedAt)}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </TabPanel>
              </div>
            </div>
          </Tabs>
        </div>

        {/* Thống kê đơn hàng */}
        <div className="OM-statistics">
          <div className="OM-statistics-title">
            <span>Thống kê </span> <span>|</span>
            <span>{orderStatusSelect.name}</span>
          </div>
          <div className="OM-statistics-main">
            <div className="OM-summary">
              <div className="statis-field">
                <p>Số lượng</p>
                <p>
                  <span>{sum.detail}</span> <span>/ {sum.total}</span>{" "}
                  <span>đơn hàng</span>
                </p>
              </div>
            </div>
            <div className="OM-review">
              <div className="statis-field">
                <p>Đã review</p>
                <p>
                  <span>{review.reviewed}</span>
                </p>
              </div>
              <div className="statis-field">
                <p>Chưa review</p>
                <p>
                  <span>{review.notReviewYet}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={isSearch ? "OM-right OM-right-active" : "OM-right"}>
        <div className="OM-right-container">
          <p className="title">Bộ lọc đơn hàng</p>
          <div className="filter-field">
            <div className="content-select">
              <div
                className={
                  filter.type === "code" ? "option option-active" : "option"
                }
                onClick={() => onSelectTypeSearch("code")}
              >
                Code
              </div>
              <div
                className={
                  filter.type === "phone" ? "option option-active" : "option"
                }
                onClick={() => onSelectTypeSearch("phone")}
              >
                Phone
              </div>
            </div>
            <div className="content">
              <input
                type="text"
                placeholder="Tìm kiếm"
                onChange={onSearchChange}
              />
            </div>
          </div>
          <div className="filter-field filter-datetime">
            <div className="label">
              <p>Thời gian</p>
              <p>Clear</p>
            </div>

            <div className="content">
              <input type="date" placeholder="Bắt đầu" />
              <i class="bi bi-arrow-right-short"></i>
              <input type="date" placeholder="Bắt đầu" />
            </div>
          </div>
          <div className="search-btn" onClick={onSearchOrder}>
            Tìm kiếm
          </div>
        </div>
      </div>

      {/* Modal area */}
      <div className="modal-container">
        <Modal
          active={isModalActive}
          action={handleModalAction}
          title={modalTitle}
          size={"nor"}
        >
          {modalAction === "O_SELECT_CONFIRM" ? (
            <O_ConfirmForm
              onFinish={onFormAction}
              active={isModalActive}
              data={orderSelected}
            />
          ) : (
            <></>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Order_M;
