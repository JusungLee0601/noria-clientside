<div align="center">

  <h1><code>snakeriver-clientside</code></h1>

  <strong>Clientside Library for the SnakeRiver System</strong>

  <h3>
    <a href="https://github.com/JusungLee0601/snakeriver-server">snakeriver-server</a>
  <br>
  <a href="https://docs.google.com/presentation/d/1ODsMf6o6zTsH2Zp_oWeKQSeTu0nmWtI7VzPwBKDrOT4/edit?usp=sharing">slide deck</a>
  <br>
  <a href="https://repository.library.brown.edu/studio/item/bdr:1140600/">poster</a>
   <br>
  </h3>
</div>

# Overview 

## SnakeRiver: A Server-Client Dataflow System For Read Heavy Web Applications

Many web applications today are read-heavy, meaning users are much more likely to access information from a server than they are to add new data. This read access is often a queried by the client over an internet connection. Computation to produce the desired read data, often on tables in a relational database, can be costly, and queries that are repeated are especially taxing for systems. Several alternative systems to relational databases exist, including Noria, a streaming dataflow system that stores data in a graph. Data and updates flow through the graph’s operator nodes, essentially precomputing a query's desired information, and are stored in ready to access tables called Views. Although this approach significantly reduces read access speeds, it still fails to circumvent the internet latency that comes with queries and data sent back and forth over the internet. 

SnakeRiver is a system where that dataflow graph exists across both server and client, executing server computation and storing View data in the client itself. Reads are therefore done locally and are incredibly fast. In specific graph scenarios, user-specific processing can also be done in the client, reducing server load and costs. This is achieved with a library of Rust functions that compiles into Web Assembly, allowing the creation of a graph that manipulates data in the browser. In our testing of several read and write scenarios, write speeds were reasonable for expected workloads, while reads remained very fast. Latency per operation was as much 10x faster than a Noria system under comparable workloads, showing that the system succeeds in lowering both latency and server computation in web applications that feature read heavy workloads.

Work was advised by [Malte Schwarzkopf](https://cs.brown.edu/news/2020/04/29/malte-schwarzkopf-wins-salomon-award-gdpr-compliant-system-design/) of the [Brown University Systems Group](https://systems.cs.brown.edu/) as part of an [UTRA](https://www.brown.edu/academics/college/fellowships/utra/) funded research opportunity, completed during the 2020 summer.

## About

This repository contains the library of functions that operate within the browser to create and manipulate the graph. It also contains the development server that serves the page content, including the HTML, CSS, and JS, or the CDN as referenced in the project poster. 

## Code Structure

- `src/operators`: operators that exist in graph, Root is stateless
- `src/types`: all types represented by enums
- `src/units`: row and change objects
- `src/viewsandgraphs`: the view and graph structures
- `index.js`: content served by CDN, also has in javascript testing that works in tandem with the SnakeRiver-server
- `lib.rs`: contains throughput and latency testing for purely clientside values, but also has throughput and latency testing

## 🚴 Usage

In root directory to compile Rust code into Web Assembly:
```
wasm-pack build
```


In /www directory to start up "CDN" server:
```
npm run start
```


In root directory to run clientside tests:
```
wasm-pack test --headless -chrome
```

# Project Writeup - The Client

## The Problem(s), Explained with Noria

Traditional database systems are relational, meaning data is stored in large tables and are accessed with queries. For many websites, reads make up the majority of these queries. Noria is a streaming dataflow system that allows for data to be precomputed incrementally, so that reads that require computation and are repeated only have to access said data from stores called Views. Below is a diagram of a potential Noria graph, specifically with how it communicates with the clients.

<img src="readme/noria_diagram.png" width="600"/>

Updates are processed incrementally, with changes modifying the base table and "flowing" downward, operated by the nodes to eventually populate the Views at the bottom of the graph. While reads are much faster, this system still relies on queries for reads and writes to occurr across an internet connection. The SnakeRiver system attempts to circumvent this latency inherent to the system.

## Moving Part of the Graph Clientside

<img src="readme/snakeriver_diagram.png" width="600"/>

In SnakeRiver, part of this dataflow graph exists in the clients that connect to the server. While the updates flowing downward and writes to base tables are eventually sent between server and client over the internet, reads are performed locally, with user relevant Views stored and operated on in the browser. The expected results are extremely fast read times, a reduction in needed read requests with more data now available to the client, and reduced computation for the server.

SnakeRiver most benefits read heavy systems with infrequent writes, where users might operate on large amounts of relatively constant data that doesn't necessarily need to be instantaneously accurate. It also might benefit scenarios where computation is user specific, say with something like a blacklist for a user timeline. Updates could then be processed through user specific subgraphs, simplifying server side computation and necessary data storage. 

## Creating the Clientside Library

<img src="readme/technologies.png" width="600"/>

The clientside library is written in Rust that is compiled into WebAssembly through the wasm-bindgen API. In communication with a server, HTML/CSS, the Rust Library, and JS files that use the rust functions to create and operate the graph are sent on initial connnection. Subgraph structure and updates are sent and built from JSON. 'src' organizes all library code.

Currently, the clientside graph - and by extension the server graph - feature a Noria-like structure. Key differences include a lack of partial/windowed state and no support for upqueries. While comparatively simple, the graph does support incremental updates, which is what allows for the system and the Views to function.

## Testing the Client

The movements from Rust to Javascript, especially with function calls to WebAssembly code, are often very limiting. Types used for function arguments are limited, and although several of the libraries used help work around this, further work must be cognizant of these limitations. Currently, the serde-json library allows for easy transferal from strings to type, especially from the JSON strings that get sent from the SnakeRiver server, but there is a lot of potential for optimizations even within the operator graph.



