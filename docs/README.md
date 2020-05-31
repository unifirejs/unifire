# What's Unifire?

Unifire is a state management solution that's tiny, efficient, capable, and easy.

### Features

* __Tiny__ 400 (brotli-compressed) bytes. No dependencies.
* __Simple__ Including the constructor, Unifire has five public methods and one public property.
* __Efficient__ Unifire only calls a subscriber when one of its dependencies changes.
* __Derived State__ Store-level computed properties have never been this easy.
* __Unopinionated Actions__ Combine sync and async mutations in a single action. Unifire will call the right subscribers at the right time, batched as efficiently as possible.
* __Code Splitting__ Register additional store modules at runtime.
* __Framework-Agnostic__ Unifire works with anything. See the Integrations docs for pre-made framwork integrations.
* __Flexible__ Unifire and its framework integrations provide explicit support for both single-store global setups and per-component one-off stores.
* __Extensions__ Unifire is easy to extend. Check out the extensions docs for available modules.

### Influences

Any new library is informed by the greats that came before it. Unifre is no different.

#### Vuex

The Vuex team did an incredible job ensuring that stores written using Vuex are readable. Its API is straightforward and declarative. If you're familiar with Vuex, you'll see it's influences on Unifire's API right away, especially in Unifire's constructor and actions.

#### Mobx

I've always been impressed by Mobx's ability to yield beautiful, simple user-written code. Mobx has mastered the art of abstracting complexity away from the user. You never have to tell Mobx what your dependencies are--it knows. This mentality informed Unifire's `subscribe` method and `unifire-preact`'s `Observer` HOC.

#### Unistore

Jason Miller's work to simplify the path to async actions while preserving a familiar API is awesome. More than anything, though, I benefited from reading Unistore's source code. `unifire-preact`'s `Observer` HOC has a couple of Jason Miller classics in it.

#### Storeon

You won't find a smaller state management system with more features than Storeon. It's pure wizardry. I referenced Storeon's code regularly as I wrote `unifire-preact`'s hooks.
