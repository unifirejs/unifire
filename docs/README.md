# What's Unifire?

Unifire is a state management solution that's tiny, efficient, capable, and easy.

One of Unifire's primary goals is flexibility. To that end, Unifire and its framework integrations provide explicit support for both single-store global setups and per-component one-off stores. You can even mix and match.

## Features

* __Tiny__ 400 (brotli-compressed) bytes. No dependencies.
* __Simple__ Including the constructor, Unifire has four public methods and one public property.
* __Efficient__ Unifire only calls a subscriber when one of its dependencies changes.
* __Derived State__ Store-level computed properties have never been this easy.
* __Unopinionated Actions__ Combine sync and async mutations in a single action. Unifire will call the right subscribers at the right time, batched as efficiently as possible.
* __Code Splitting__ Register additional store modules at runtime.
* __Framework-Agnostic__ Unifire works with anything. See the Integrations docs for pre-made framwork integrations.
* __Plugins__ ???? If so, make sure to update the download size, write/document a plugin, and document how to write plugins.

## Why does Unifire exist?

There are so many amazing state management solutions out there. However, most of them live close to one end or the other of a spectrum that looks like this:

```
sub-1kb                     3-15kb
faster boot                 slower boot
slower runtime              faster runtime
few features                many features
```

The libraries closer to the left side of this spectrum are faster to download and parse but generally don't have dependency tracking and therefore call every subscriber on every state change. They usually also have fewer features.

The libraries on the right track dependencies and are therefore more efficient during runtime. This greater efficiency, along with typically providing more features, means a greater bootup cost.

Unifire was born out of a desire to achieve the best of both ends of this spectrum. I wanted a library that was sub-1kb for boot performance but that also tracked dependencies for runtime performance. I wanted a library that had features like store-level derived state, plugins??, and code splitting support. I wanted a library whose source code you can read--and understand--in the time it takes to eat a sandwich.

Most of all, I wrote Unifire for me.

## Why the emphasis on download size?

If you find yourself thinking that I'm making way too big of a deal about the ~5+kb difference between Unifire and a more robust state management solution, I can deffinitely see where you're coming from. 5kb is not going to make or break your app's performance.

But an app's performance is all-too-often a story of death by a thousand cuts.
* react is 30kb larger than preact.
* react-router is 5.3kb larger than preact-router.
* react-redux is 4.2kb larger than unifire.
* styled-components is 12.5kb larger than CSS modules
* etcetera

If you went with the smaller options __*in these four cases alone*__, your app would already be over 50kb smaller. Apply this kind of performance awareness to all of your third-party imports and your users will notice a difference.

## Influences

Any new library is informed by the greats that came before it. Unifre is no different.

### Vuex

The Vuex team did an incredible job ensuring that stores written using Vuex are readable. Its API is straightforward and declarative. If you're familiar with Vuex, you'll see it's influences on Unifire's API right away, especially in Unifire's constructor and actions.

### Mobx

I've always been impressed by Mobx's ability to yield beautiful, simple user-written code. Mobx has mastered the art of abstracting complexity away from the user. You never have to tell Mobx what your dependencies are--it knows. This mentality informed Unifire's `subscribe` method and `unifire-preact`'s `Observer` HOC.

### Unistore

Jason Miller's work to simplify the path to async actions while preserving a familiar API is awesome. More than anything, though, I benefited from reading Unistore's source code. `unifire-preact`'s `Observer` HOC has a couple of Jason Miller classics in it.

### Storeon

You won't find a smaller, state management system with more features than Storeon. It's pure wizardry. I referenced Storeon's code regularly as I wrote `unifire-preact`'s hooks.
