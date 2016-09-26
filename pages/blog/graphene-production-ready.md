---
layout: page
title: "Graphene is now production ready!"
description: "Released the version 1.0 of Graphene"
---

Graphene is now one year old!
We have a lot of news for all the GraphQL enthusiats in Python.


For celebrating the first year of Graphene, we are lunching the next
and **production-ready** version of graphene... `v1.0`! It's already being
used in more than 30 companies in production, don't be shy and give it a try!


But, what are the main changes of this **[new shiny version](https://github.com/graphql-python/graphene/)**?

## All Integrations in different Repos

Now all the integrations are separated from the core Graphene codebase.

By isolating each Graphene integration into its own repo, now we are
able to iterate in each separately, apart of handling better the permission roles
for maintainers and contributors. **We are really excited about this!**

  - [Graphene-Django](https://github.com/graphql-python/graphene-django/)
  - [Graphene-SQLAlchemy](https://github.com/graphql-python/graphene-sqlalchemy/)
  - [Graphene-GAE](https://github.com/graphql-python/graphene-gae/)
  - Graphene-Peewee ([in progress](https://github.com/graphql-python/graphene/issues/289))

Also, the **documentation is now isolated** in each repo and generated using *Sphinx*! (as most of the Python projects)

## Better Abstractions

Ok, it's hard to do a maintainable Python package based in the in the
syntactic sugar magic behind the metaclasses.

But we did major efforts to improve the abstractions that will let us handle
better the cases and minimize any future bugs.

What we mean with "better abstractions"?

 - **Inheriting a interface** now have to be done explicitly, by adding it into the Meta, not by subclassing.
   This help to better scope of the logic of a ObjectType and Interface, handled by separate.
 - The **schema is no longer aware of it's execution and middleware**, therefore this logic be living
   living on the context of the execution rather than the schema.
 - The GraphQL native types are generated in one step using a **TypeMap when creating the schema**, and graphene
   now doesn't interpose with the GraphQL types. This helps us achieve much cleaner code
   and code parallization easier.
 - The **Graphene-Django integration is now full grown up**, the GraphQL and GraphiQL views are now bundled into the package
   requiring much less integration effort for the developer.
 - Better and faster testing.
 - [Promises in Python](https://github.com/syrusakbary/promise)! This simplifies by a huge
   marging how we have to handle paralization in different environments while preserving the syntax.
   PS: This feature was actually available since `v0.8`, but any emphasize is not enough!
 - Versioning [like a pro](https://github.com/graphql-python/graphene/blob/master/graphene/pyutils/version.py)!

Please **check the [Upgrade Guide to 1.0](https://github.com/graphql-python/graphene/blob/master/UPGRADE-v1.0.md)** to see what you have to change if you were using a `0.x` version.

## 20x Speed Improvement

The first version of Graphene had some **severe speed issues** when performed against quite large datasets
(100k+ elements).

By removing unnecessary abstractions, resolution wrappers and adding
a simple caching mechanism in the function resolution discovery **we achieved
10-20x speed improvement**.


But that's not all... [we are working to increase it another 10-50x](https://github.com/graphql-python/graphene/issues/268#issuecomment-245507085)! (That's a total
of **100x-1000x faster** of what it was!).

We would de able to achieve this by adding an extra step after the query AST generation that will decide in build
time (instead of runtime, as it is now) what are the type resolvers that the query have to use! (plus Cython, when possible)

Don't be worried though, Graphene `1.0` it's super fast... we just want to be as fast as Protocol Buffers
or CapN Proto!


## A Year Full of Workshops and Talks

The Graphene community had been great since the start.
A lot of people helped to spread the word by doing talks, workshops, here are some!

 - **[GraphQL in non-js servers](https://www.youtube.com/watch?v=RNoyPSrQyPs)** - React.js Conf
 - **[Zero to GraphQL](https://www.youtube.com/watch?v=UBGzsb2UkeY)** by [@Steven Luscher](https://twitter.com/steveluscher)
 - **[Parallelization, Aggregation and Validation of API in Python](http://www.slideshare.net/MaxKlymyshyn/piterpy-2016-parallelization-aggregation-and-validation-of-api-in-python)** by [@Max Klymyshyn](https://twitter.com/maxmaxmaxmax)
 - **[A GraphQL Lightning Talk](https://medium.com/@idangazit/a-graphql-lightning-talk-29838f22462e)** - DjangoCon Europe by [@Idan Gazit](https://twitter.com/idangazit)
 - **[Introduction to Graphene and Relay](https://speakerdeck.com/mjtamlyn/an-introduction-to-graphene-and-relay)** - PyConUK by [@Marc Tamlyn](https://twitter.com/mjtamlyn)
 - **[A New Look Into APIS - Graphene](https://www.youtube.com/watch?v=BG1H6IrNbAk)** - DjangoCon US
 - **[PyConChina talk](http://cn.pycon.org/2016/hangzhou.html)**


## New Website!

[GraphQL.org](http://graphql.org) did a fantastic job on the new version of its website.

So we had to make an effort too!

Now, the page is faster, prettier and easier to maintain (thanks too to the isolated docs).
With the plus of the [playground redesign](/playground/)!


## Extra: Downloads

Graphene it's been **installed more than 50.000 times** in its first year, and **just about 10.000 the last month**.
This number is actually low compared to what we aim to achieve in the upcoming years.
<br><br>

Hope you all enjoy this new version as I enjoyed the road with all of you :)

Let Graphene be with you!

<br>
Thanks,<br>Syrus Akbary
