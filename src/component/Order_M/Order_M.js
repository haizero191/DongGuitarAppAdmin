import React, { useEffect, useState } from "react";
import "./Order_M.scss";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Modal from "../Modal/Modal";
import OrderAPI from "../../apis/Order/OrderAPI";
import Loading from "../Loading/Loading";
import O_ConfirmForm from "../../utils/OrderAction/O_ConfirmForm/O_ConfirmForm";

const Order_M = ({ onLoad }) => {
  const [data, setData] = useState([]);
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
    loadData()
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
  const onSelectOrder = (order) => {
    setIsModalActive(true);
    setModalAction("O_SELECT_CONFIRM");
    setModalTitle("ORDER INFORMATION");
    setOrderSelected(order);
    updateReviewOrder(order)
  };


  const updateReviewOrder = (order) => {
    var updateOrder = order;
    updateOrder.IsReview = true;
    OrderAPI.update(updateOrder._id, updateOrder)
  }

  // Handle Order status tabs change
  const handleTabChange = (index) => {
    setOrderStatusSelect(orderStatusList[index]);
  };

  const loadData = () => {
    const getOrdersWithStatus = async () => {
      setIsLoading(true);
      var Get_Order_With_Status_Result = await OrderAPI.get({
        status: orderStatusSelect.status,
      });
      if (Get_Order_With_Status_Result.success) {
        setTimeout(() => {
          setIsLoading(false);
          setOrderList(Get_Order_With_Status_Result.data);
          console.log(Get_Order_With_Status_Result.data);
        }, 250);
      } else {
        setTimeout(() => {
          setIsLoading(false);
          setOrderList([]);
        }, 250);
      }
    };
    getOrdersWithStatus();
  };

  const onFormAction = (data) => {
    if (data.status === "FORM_FINISHED") {
      setIsModalActive(false);
    }
    if (data.status === "FORM_CANCEL") {
      setIsModalActive(false);
    }

    loadData();
  };

  return (
    <div className="Order_M">
      <div className="OM-left">
        <Tabs onSelect={(index) => handleTabChange(index)}>
          <div className="OM-header">
            <div className="title">Quản lí đơn hàng</div>
          </div>
          <div className="OM-main">
            <div className="order-status-tabs">
              <div className="tabs-container">
                <TabList>
                  {orderStatusList.map((os, index) => {
                    return <Tab key={"status-tab-" + index}>{os.name}</Tab>;
                  })}
                </TabList>
              </div>
            </div>

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
                      <div className="order-h-item order-h-time">Thời gian</div>
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
                                className={"order-item " + (!order.IsReview ? "new-order-item" : "")}
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
                                <div className="order-time">dd/mm/yyyy</div>
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
          </div>
        </Tabs>
      </div>
      <div className="OM-right"></div>

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

          {modalAction === "P_EDIT" ? (
            // <P_EditForm
            //   onFinish={onSaveProduct}
            //   active={isModalActive}
            //   data={data.find((p) => p._id === productSelected[0])}
            // />
            <></>
          ) : (
            <></>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Order_M;
