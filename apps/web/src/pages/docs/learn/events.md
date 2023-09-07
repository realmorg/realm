---
layout: ../../../layouts/Docs.astro
menuGroup: docs
menuTitle: 11. Events
menuOrder: 11
title: Events & Communication Between Elements
author: Ribhararnus Pracutian
description: Learn how to listen events and communicate between elements using events.
---

In Realm, there are three fundamental events that play a crucial role:

1. Custom Element Mounting: This event occurs when a custom element is fully loaded and ready to be used. It signifies that the element has been successfully created and initialized, making it available for interaction and manipulation.

2. Attribute and State Changes: This event is triggered whenever there are modifications to the attributes or states of a custom element. When attributes or states are updated, this event allows you to capture and respond to the changes, enabling dynamic behavior and reactivity within your custom elements.

3. Custom Events: These events come into play when a `<send-event>` action is triggered. You can define custom events and associate them with specific actions or behaviors. When the `<send-event>` action is invoked, the corresponding custom event is triggered, allowing you to execute specific logic or communicate with other elements.

Understanding these three basic events is crucial for developing interactive and responsive custom business logic in Realm. In this tutorial, we will learn how to listen to these events and communicate between elements using events.

## How to listen to events?

In our previous tutorial on <anchor-link href="/docs/learn/flow">Element Flow</anchor-link>, we explored two essential flows that are closely related to events. We learned about `<trigger-event>`, that you are already familiar with, which allows us to initiate or trigger specific actions within an element. Now, we're diving into the topic of `<listen-event>`.

The `<listen-event>` element's flow is all about listening and responding to events that are triggered by `<send-event>` action. With `<listen-event>`, you can define specific events to listen for, and when those events occur, you can execute corresponding actions or behaviors within your element. It enables effective communication and coordination between different elements, allowing them to interact and respond to events triggered by one another.

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
    Is loading value: <slot name="#is-loading"></slot>
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

## Send events

In certain cases, we may find ourselves in need of creating custom events in addition to the native events provided by the browser, such as `click`, `input`, `change`, and so on. Custom events allow us to define our own unique events that are specific to our application's requirements and functionalities.

By creating custom events, we can expand the range of interactions and behaviors that our elements can respond to. These events can be triggered programmatically or in response to certain conditions or user actions. Custom events provide a way to encapsulate and communicate specific actions or states within our custom elements.

Whether it's simulating user interactions, or facilitating communication between elements, custom events offer a powerful mechanism to extend the event system and tailor it to our specific needs. Realms provides the capability to define and utilize these custom events, empowering us to create more dynamic and interactive web apps.

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

You'll be happy to know that in Realms, there's a cool way to send data from a child element to its parent element using the `to:parent` attribute. It's a nifty feature that allows for smooth communication and data transfer between the two.

When you use the `to:parent` attribute, you're essentially saying, "Hey, parent element, here's some data for you!" This comes in handy when you want to pass important information, like user input or selected options, from a child element to its parent. By doing so, you enable seamless data flow and coordination between the elements in your application.

So, with the `to:parent` attribute, you can easily establish a communication channel to send data from child elements to their parent elements. It's a fantastic way to enhance the interactivity and functionality of your Realms application by keeping everyone in the loop!

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

## Congrats, don't even skip!

You've made it to the end of this tutorial! We still have more fundamental concepts to cover, but you're already well on your way to becoming a Realm master. In the next tutorial, we'll learn about <anchor-link href="/docs/learn/conditional-rendering">Conditional Rendering</anchor-link> and <anchor-link href="/docs/learn/list-rendering">List Rendering</anchor-link>.
