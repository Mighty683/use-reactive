export class ContextEventBus<T> {
  private static eventKey = "update";
  private eventTarget = new EventTarget();
  public value?: T;
  constructor(value?: T) {
    this.value = value;
  }
  addUpdateListener(dataCallback: (data: T) => void) {
    const callback = (e: Event) => {
      if (e instanceof CustomEvent) {
        dataCallback(e.detail);
      }
    };
    this.eventTarget.addEventListener(ContextEventBus.eventKey, callback);

    return () =>
      this.eventTarget.removeEventListener(ContextEventBus.eventKey, callback);
  }
  dispatchUpdate(data: T) {
    this.eventTarget.dispatchEvent(
      new CustomEvent(ContextEventBus.eventKey, {
        detail: data,
      }),
    );
  }
}
