import { Modal, ModalFuncProps } from "ant-design-vue";

export const LemAntModal = (opt: ModalFuncProps) => {
  return Modal.confirm({
    ...opt,
    keyboard: opt.keyboard || false, // 是否支持键盘 esc 关闭
    maskClosable: opt.maskClosable || false, // 点击蒙层是否允许关闭
    maskStyle: {
      backgroundColor: "rgba(0,0,0,0.1)",
      backdropFilter: "blur(10px)",
    },
    wrapClassName: "Stereobox",
    title: opt.title,
    cancelText: opt.cancelText || "取消",
    okText: opt.okText || "确认",
  });
};
