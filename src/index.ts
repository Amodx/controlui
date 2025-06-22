export * from "./UI.event";
export * from "./UI.elements";
import {
  UIElement,
  UIContainer,
  UIRootElement,
  UIScreen,
  UIScreens,
  UIModal,
} from "./UI.elements";

declare global {
  interface HTMLElementTagNameMap {
    "ui-root": UIRootElement;
    "ui-screens": UIScreens;
    "ui-screen": UIScreen;
    "ui-container": UIContainer;
    "ui-modal": UIModal;
    "ui-elm": UIElement;
  }
}
