---
title: Direction
description: A wrapper that sets left-to-right or right-to-left text direction for everything inside it.
group: Layout
order: 503
nav: Direction
---

# Direction

`ui-direction` sets the native `dir` attribute on itself and uses `display: contents`, so it adds no box of its own.
Everything inside inherits the direction: text alignment, logical CSS properties such as `margin-inline-start`, and
the keyboard behaviour of components that use `focusgroup`, where Left and Right swap in right-to-left content.

```html live
<ui-direction dir="rtl">
  <div class="demo-narrow demo-stack-tight">
    <ui-breadcrumb label="مسار التنقل">
      <ui-breadcrumb-list>
        <ui-breadcrumb-item><ui-breadcrumb-link href="#">الرئيسية</ui-breadcrumb-link></ui-breadcrumb-item>
        <ui-breadcrumb-separator></ui-breadcrumb-separator>
        <ui-breadcrumb-item><ui-breadcrumb-link href="#">المكونات</ui-breadcrumb-link></ui-breadcrumb-item>
        <ui-breadcrumb-separator></ui-breadcrumb-separator>
        <ui-breadcrumb-item><ui-breadcrumb-page>الاتجاه</ui-breadcrumb-page></ui-breadcrumb-item>
      </ui-breadcrumb-list>
    </ui-breadcrumb>
    <ui-input aria-label="بحث" placeholder="ابحث في الوثائق"></ui-input>
    <div class="demo-row-tight">
      <ui-button>حفظ</ui-button>
      <ui-button variant="outline">إلغاء</ui-button>
    </div>
  </div>
</ui-direction>
```

## Examples

### Keyboard in right-to-left content

Tabs, toggle groups and other components built on `focusgroup` read the direction. In this right-to-left tab list
the first tab is on the right, and the Left arrow moves to the next tab.

```html live
<ui-direction dir="rtl">
  <div class="demo-narrow">
    <ui-tabs value="account">
      <ui-tabs-list>
        <ui-tabs-trigger value="account">الحساب</ui-tabs-trigger>
        <ui-tabs-trigger value="password">كلمة المرور</ui-tabs-trigger>
        <ui-tabs-trigger value="team">الفريق</ui-tabs-trigger>
      </ui-tabs-list>
      <ui-tabs-content value="account"><p class="demo-text">إعدادات الحساب.</p></ui-tabs-content>
      <ui-tabs-content value="password"><p class="demo-text">تغيير كلمة المرور.</p></ui-tabs-content>
      <ui-tabs-content value="team"><p class="demo-text">إدارة الفريق.</p></ui-tabs-content>
    </ui-tabs>
  </div>
</ui-direction>
```

### Left to right inside right to left

Directions nest. `dir="ltr"` restores left-to-right for a part of the page, such as a code sample.

```html live
<ui-direction dir="rtl">
  <div class="demo-narrow demo-stack-tight">
    <p class="demo-text">ثبّت الحزمة بالأمر التالي:</p>
    <ui-direction dir="ltr">
      <p class="demo-text"><code>npm install @realmorg/ui</code></p>
    </ui-direction>
  </div>
</ui-direction>
```

## API

### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `dir` | `"ltr"` \| `"rtl"` | `"ltr"` | Text direction for the content. Written back to the native `dir` attribute, so it is always present on the element. |

### Slots

| Slot | Description |
| --- | --- |
| (default) | The content that takes the direction. |

### Accessibility

The native `dir` attribute is what browsers and assistive technology use, so screen readers and text selection
follow the direction. Set `lang` alongside it (for example `lang="ar"`) when the content is in another language.
