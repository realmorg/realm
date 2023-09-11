---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 11. Events
menuOrder: 11
title: Events & Communication Between Elements
author: Ribhararnus Pracutian
description: Learn how to listen events and communicate between elements using events.
---

In the realm of Realm, there exist three fundamental events, each playing a pivotal role:

1. **Custom Element Mounting:** This event unfurls its banner when a custom element stands fully formed, ready to engage. It signals the birth of an element, confirming its initiation into the world of interactions and manipulations.

2. **Attribute and State Changes:** This event takes the stage whenever attributes or states undergo transformations within a custom element. As attributes or states metamorphose, this event stands sentinel, prepared to capture and respond to these changes, ushering in dynamic behaviors and reactivity within your custom creations.

3. **Custom Events:** These events come alive when the curtains rise for a `<send-event>` action. Custom events are scripts written for specific actions or behaviors, akin to bespoke performances in a grand theater. When the `<send-event>` action takes its cue, the corresponding custom event takes the spotlight, enabling you to execute precise logic or engage in dialogues with other elements.

Understanding these three fundamental events forms the cornerstone of crafting interactive and responsive custom business logic within the Realm. In this tutorial, we shall unravel the art of listening to these events and establishing communication channels between elements, orchestrating a symphony of interactivity.

## How to Listen to Events?

In our previous tutorial on <anchor-link href="/docs/learn/flow">Element Flow</anchor-link>, we embarked on a journey exploring two vital flows intimately entwined with events. You've already encountered `<trigger-event>`, which serves as your trusty companion in initiating or sparking specific actions within an element. Now, our voyage delves deeper into the realm of `<listen-event>`.

The flow of `<listen-event>` revolves around the fine art of attentive listening and swift responses to events triggered by the enchanting `<send-event>` action. With `<listen-event>`, you wield the power to specify the events you wish to heed, and as these events unfold, you conduct an orchestra of actions and behaviors within your element. This flow seamlessly enables communication and coordination between various elements, ushering in a world where elements interact and react to each other's cues.

```html
<custom-element name="your-element">
  <element-attr name="is-open" type="boolean">false</element-state>
  <element-state name="is-loading" type="boolean">false</element-state>

  <element-flow>
    <listen-event mounted>
      <set-state name="is-loading" value="false"></set-state>
      <script type="module/realm" use="localState">
        // do fetch API call here
        // then set the state
      </script>
    </listen-event>

    <listen-event attrchanged>
      <!-- Listen on all attributes changes -->
    </listen-event>

    <listen-event attrchanged="is-open">
      <!-- Listen on specific attribute `is-open` changed -->
    </listen-event>

    <listen-event statechanged>
      <!-- Listen on all states changed, including global states  -->
    </listen-event>

    <listen-event statechanged="is-loading">
      <!-- Listen on specific state `is-loading` changed -->
    </listen-event>

    <!-- Listen on custom event -->
    <listen-event event="custom-event">
      <!-- Add action tag here -->
    </listen-event>
  </element-flow>

  <template>
    <!-- Your custom element's UI -->
  </template>
</custom-element>
```

## Example: Derived state from attribute

This following example shows how to derive state from attribute. In this example, we have a custom element called `<my-element>` that has an attribute called `is-open`. We want to derive a state called `is-loading` from the `is-open` attribute. Whenever the `is-open` attribute changes, the `is-loading` state will be updated accordingly.

```html
<custom-element name="my-element">
  <element-attr name="is-open" type="boolean">false</element-attr>
  <element-state name="is-loading" type="boolean">false</element-state>

  <element-flow>
    <listen-event mounted>
      <set-state name="is-loading" value="$.is-open" from="attr"></set-state>
    </listen-event>
  </element-flow>

  <template>
    Is loading value:
    <slot name="#is-loading"></slot>
  </template>
</custom-element>

<my-element is-open="true"></my-element>
```

<custom-element name="my-element">
  <element-attr name="is-open" type="boolean">false</element-attr>
  <element-state name="is-loading" type="boolean">false</element-state>

  <element-flow>
    <listen-event mounted>
      <set-state name="is-loading" value="$.is-open" from="attr"></set-state>
    </listen-event>
  </element-flow>

  <template>
    Is loading value: <slot name="#is-loading"></slot>
  </template>
</custom-element>

<realm-demo>
  <my-element is-open="true"></my-element>
</realm-demo>

## Sending Custom Events

Sometimes, our needs go beyond the repertoire of native browser events like `click`, `input`, and `change`. In such cases, custom events become our secret weapon. These bespoke events are tailored to our application's unique demands, expanding the horizons of what our elements can perceive and respond to.

Custom events grant us the authority to define our own distinct events, perfectly aligned with our application's idiosyncrasies. They can be invoked programmatically or triggered in response to specific conditions or user actions. These events serve as containers, encapsulating particular actions or states within our custom elements.

Whether it's orchestrating simulated user interactions or establishing channels of communication between elements, custom events empower us to augment the event system, customizing it to our precise requirements. In Realm, you possess the ability to craft and deploy these custom events, bestowing your web applications with a touch of dynamism and interactivity.

```html
<custom-element name="child-element">
  <element-state name="counter" type="number">0</element-state>

  <element-flow>
    <listen-event on="add-counter">
      <set-state name="counter" value="1" mutate="+"></set-state>
    </listen-event>
    <trigger-event click="AddCounterButton">
      <send-event name="add-counter"></send-event>
    </trigger-event>
  </element-flow>

  <template>
    <button ref="AddCounterButton">Add count <slot name="#counter"></slot>
  </template>
</custom-element>

<custom-element name="main-element">
  <element-flow>
    <trigger-event click="AddCounterToChildButton">
      <send-event name="add-counter" to="my-child"></send-event>
    </trigger-event>
  </element-flow>

  <template>
    <child-element ref="my-child"></child-element>
    <button ref="AddCounterToChildButton">Give +1 to our child</button>
  </template>
</custom-element>

<main-element></main-element>
```

<custom-element name="child-element">
  <element-state name="counter" type="number">0</element-state>

  <element-flow>
    <listen-event on="add-counter">
      <set-state name="counter" value="1" mutate="+"></set-state>
    </listen-event>
    <trigger-event click="AddCounterButton">
      <send-event name="add-counter"></send-event>
    </trigger-event>
  </element-flow>

  <template>
    <button ref="AddCounterButton">Add count <slot name="#counter"></slot>
  </template>
</custom-element>

<custom-element name="main-element">
  <element-flow>
    <trigger-event click="AddCounterToChildButton">
      <send-event name="add-counter" to="my-child"></send-event>
    </trigger-event>
  </element-flow>

  <template>
    <child-element ref="my-child"></child-element>
    <button ref="AddCounterToChildButton">Give +1 to our child</button>
  </template>
</custom-element>

<realm-demo>
  <main-element></main-element>
</realm-demo>

## Sending Data to the Parent

In the world of Realms, there's a clever method for transmitting data from a child element to its parent counterpart, and it's called the `to:parent` attribute. This feature adds a touch of finesse to communication and data exchange between the two elements.

When you employ the `to:parent` attribute, you're essentially saying, "Dear parent element, I've got some data you might find interesting!" This capability proves invaluable when you need to convey vital information, such as user input or selected options, from a child element to its parent. By doing so, you establish a seamless conduit for data flow and coordination between elements within your application.

With the `to:parent` attribute at your disposal, establishing a communication channel to transmit data from child elements to their parent counterparts becomes a breeze. It's a remarkable way to elevate the interactivity and functionality of your Realms application, ensuring that everyone stays in the know!

```html
<custom-element name="child-element">
  <element-state name="counter" type="number">0</element-state>

  <element-flow>
    <listen-event on="add-counter">
      <set-state name="counter" value="1" mutate="+"></set-state>
      <send-event to:parent name="update-main-counter"> </send-event>
    </listen-event>

    <trigger-event click="AddCounterButton">
      <send-event name="add-counter"></send-event>
    </trigger-event>
  </element-flow>

  <template>
    <button ref="AddCounterButton">Add count <slot name="#counter"></slot>
  </template>
</custom-element>

<custom-element name="main-element">
  <element-state name="main-counter" type="number">0</element-state>

  <element-flow>
    <listen-event on="update-main-counter">
      <set-state name="main-counter" value="1" mutate="+"></set-state>
    </listen-event>

    <trigger-event click="AddCounterToChildButton">
      <send-event name="add-counter" to="my-child"></send-event>
    </trigger-event>
  </element-flow>

  <template>
    <child-element ref="my-child"></child-element>
    <button ref="AddCounterToChildButton">Give +1 to our child</button>
    Main counter: <slot name="#main-counter"></slot>
  </template>
</custom-element>

<main-element></main-element>
```

<custom-element name="child-element-2">
  <element-state name="counter" type="number">0</element-state>

  <element-flow>
    <listen-event on="add-counter">
      <set-state name="counter" value="1" mutate="+"></set-state>
      <send-event to:parent name="update-main-counter"> </send-event>
    </listen-event>
    <trigger-event click="AddCounterButton">
      <send-event name="add-counter"></send-event>
    </trigger-event>
  </element-flow>

  <template>
    <button ref="AddCounterButton">Add count <slot name="#counter"></slot>
  </template>
</custom-element>

<custom-element name="main-element-2">
  <element-state name="main-counter" type="number">0</element-state>

  <element-flow>
    <listen-event on="update-main-counter">
      <set-state name="main-counter" value="1" mutate="+"></set-state>
    </listen-event>
    <trigger-event click="AddCounterToChildButton">
      <send-event name="add-counter" to="my-child"></send-event>
    </trigger-event>
  </element-flow>

  <template>
    <child-element-2 ref="my-child"></child-element-2>
    <button ref="AddCounterToChildButton">Give +1 to our child</button>
    Main counter: <slot name="#main-counter"></slot>
  </template>
</custom-element>

<realm-demo>
  <main-element-2></main-element-2>
</realm-demo>

## Congratulations, Don't Skip a Beat!

You've reached the conclusion of this tutorial, and your journey into the Realm is well underway. While there are more fundamental concepts waiting to be explored, you're already making great strides toward becoming a true Realm master. In the next tutorial, we'll delve into the realms of <anchor-link href="/docs/learn/conditional-rendering">Conditional Rendering</anchor-link> and <anchor-link href="/docs/learn/list-rendering">List Rendering</anchor-link>.
