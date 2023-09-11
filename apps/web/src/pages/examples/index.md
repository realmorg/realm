---
layout: ../../layouts/Docs.astro
menuGroup: examples
menuTitle: Overview
menuOrder: 1
title: Collection examples of Realm
author: Ribhararnus Pracutian
description: Collection examples of Realm
---

This is a collection of Realm examples that you can use to learn Realm. The examples are divided into several categories:

<custom-element name="column-layout">
  <template>
    <style>
      :host {
        display: flex;
        gap: 2vh;
        flex-direction: column;
      }
      ::slotted(div) {
        width: 100%;
      }
      @media screen and (min-width: 1024px) {
        :host {
          flex-direction: row;
          gap: 10vw;
        }
        ::slotted(div) {
          flex: 1;
          width: 50%;
        }
      }
    </style>
    <slot name="left"></slot>
    <slot name="right"></slot>
  </template>
</custom-element>

<column-layout>
  <div slot="left">
    <h3>Basic</h3>
    The basic examples are the most fundamental examples of Realm. They cover the basic concepts of Realm.
    <ul>
      <li><anchor-link href="/examples/basics/hello-world">Hello World</anchor-link></li>
      <li><anchor-link href="/examples/basics/attribute-bindings">Attribute Bindings</anchor-link></li>
      <li><anchor-link href="/examples/basics/form-bindings">Form Bindings</anchor-link></li>
      <li><anchor-link href="/examples/basics/conditional-rendering">Conditional Rendering</anchor-link></li>
      <li><anchor-link href="/examples/basics/list-rendering">List Rendering</anchor-link></li>
    </ul>
  </div>

  <div slot="right">
    <h3>States</h3>
    The basic example covers how to work with states in Realm.
    <ul>
      <li><anchor-link href="/examples/states/basic-state">Basic State</anchor-link></li>
      <li><anchor-link href="/examples/states/state-number">State: Number</anchor-link></li>
      <li><anchor-link href="/examples/states/state-boolean">State: Boolean</anchor-link></li>
      <li><anchor-link href="/examples/states/state-array">State: Array</anchor-link></li>
      <li><anchor-link href="/examples/states/state-html">State: HTML</anchor-link></li>
      <li><anchor-link href="/examples/states/basic-global-state">Basic Global State</anchor-link></li>
      <li><anchor-link href="/examples/states/global-state-localstorage">Global State: Local Storage</anchor-link></li>
      <li><anchor-link href="/examples/states/global-state-sessionstorage">Global State: Session Storage</anchor-link></li>
    </ul>
  </div>
</column-layout>

<column-layout>
  <div slot="left">
    <h3>Styling</h3>
    The styling examples cover how to dynamic CSS inside custom element Shadow DOM.
    <ul>
      <li><anchor-link href="/examples/styling/dynamic-css-vars">Dynamic CSS Variables</anchor-link></li>
      <li><anchor-link href="/examples/styling/css-conditional-styling">Conditional Styling</anchor-link></li>
    </ul>
  </div>
  <div slot="right">
    <h3>Events / Lifecycle</h3>
    The events examples cover how to work with lifecycle and custom events in Realm.
    <ul>
      <li><anchor-link href="/examples/events/custom-event">Custom Event</anchor-link></li>
      <li><anchor-link href="/examples/events/mounted-event">Mounted Event</anchor-link></li>
      <li><anchor-link href="/examples/events/attr-changed-event">Attributes Changed Event</anchor-link></li>
      <li><anchor-link href="/examples/events/states-changed-event">States Changed Event</anchor-link></li>
    </ul>
  </div>
</column-layout>

<column-layout>
  <div slot="left">
    <h3>HTTP</h3>
    Realm provides a built-in HTTP client that you can use to fetch data from the server.
    <ul>
      <li><anchor-link href="/examples/http/basic-http">Basic HTTP Request</anchor-link></li>
      <li><anchor-link href="/examples/http/success-response">Success Response</anchor-link></li>
      <li><anchor-link href="/examples/http/fails-response">Fails Response</anchor-link></li>
    </ul>
  </div>
  <div slot="right">
    <h3>Misccellaneous</h3>
    <ul>
      <li><anchor-link href="/examples/misc/mouse-tracking">Mouse Tracking</anchor-link></li>
      <li><anchor-link href="/examples/misc/debounce-trigger">Debounce Trigger</anchor-link></li>
    </ul>
  </div>
</column-layout>
