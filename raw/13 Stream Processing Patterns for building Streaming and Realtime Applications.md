---
title: "13 Stream Processing Patterns for building Streaming and Realtime Applications"
source: "https://iwringer.wordpress.com/2015/08/03/patterns-for-streaming-realtime-analytics/"
author:
  - "[[Srinath Perera]]"
published: 2015-08-03
created: 2026-04-29
description: "Introduction More and more use cases, we want to react to data faster, rather than storing them in a disk and periodically processing and acting on the data. This is done using Realtime analytics. Realtime analytics, or what people call Realtime Analytics, have two flavors. Realtime Interactive/Ad-hoc Analytics (users issue ad-hoc dynamic queries and the…"
tags:
  - "clippings"
---
## Introduction

More and more use cases, we want to react to data faster, rather than storing them in a disk and periodically processing and acting on the data. This is done using Realtime analytics.

Realtime analytics, or what people call Realtime Analytics, have two flavors.

1. Realtime **Interactive/Ad-hoc Analytics** (users issue ad-hoc dynamic queries and the system responds interactively). Examples of such tools are Druid, SAP Hana, VoltDB, MemSQL, and Apache Drill.
2. **Realtime Streaming Analytics / Stream Processing** ( users issue static queries once and they do not change, and the system process data as they come in without storing). This is supported by Stream Processors and among examples of such tools are WSO2 Stream Processors and Apache Flink. ( see [What is Stream Processing?](https://medium.com/@srinathperera/what-is-stream-processing-1eadfca11b97) for more details)

Realtime Interactive Analytics allows users to explore a large data set by issuing ad-hoc queries. Queries should respond within 10 seconds, which is considered the upper bound for acceptable human interaction. In contrast, this tutorial focuses on Stream Processing, which is processing data as they come in without storing them and react to those data very fast, often within few milliseconds. Such technologies are not new. History goes back to Active Databases (2000+), Stream processing (e.g. Aurora (2003), Borealis (2005+) and later Apache Storm), Distributed Streaming Operators(2005), and Complex Event processing. Between 2015-2018, most of these technologies have converged under the theme Steam Processing (see [CEP vs. Stream Processing](https://iwringer.wordpress.com/2015/12/15/cep-vs-streaming-processing-vs-cep-engines-vs-streaming-analytic-engines/)) for more information.

when thinking about Realtime analytics, many think only about counting use cases. Counting use cases are only the tip of the iceberg of real-life realtime use cases. Since the input data arrives as a data stream, a time dimension always presents in the data. This time dimension allows us to implement and perform many powerful use cases. For an example, Streaming SQL supported by many Stream Processors provides operators like windows, joins, and temporal event sequence detection.

Stream processing technologies like [Apache Samza](http://samza.apache.org/) and [Apache Storm](https://storm.apache.org/) has received much attention under the theme of large-scale streaming analytics. However, these tools force every programmer to design and implement real-time analytics processing from first principals.

For an example, if users need a time window, they need to implement it from first principals. This is like every programmer implementing his own list data structure.

Since 2016, a new idea called [Streaming SQL](https://www.quora.com/unanswered/What-is-a-Streaming-SQL-What-are-the-tools-supporting-Streaming-SQL) has emerged. We call a language that enables users to write SQL like queries to query streaming data as a “Streaming SQL” language. Almost all Stream Processors now support Streaming SQL.

However, writing Streaming Applications requires very different thinking patterns from writing code with a language like Java. A better understanding of common patterns in Stream Processing will let us understand the domain better and build tools that handle those scenarios. This tutorial describes 13 common relatime streaming analytics patterns and how to implement them. In the discussion, we will draw heavily from real life use cases done under Stream Processing and other technologies.

## Realtime Streaming Analytics Patterns

Before looking at the patterns, let’s first agree on the terminology. Stream Processing accepts input as a set of streams where each stream consists of many events ordered in time. Each event has many attributes, but all events in the same stream have the same set of attributes or schema.

### Pattern 1: Preprocessing

Preprocessing is often done as a projection from one data stream to the other or through filtering. Potential operations include

- Filtering and removing some events
- Reshaping a stream by removing, renaming, or adding new attributes to a stream
- Splitting and combining attributes in a stream
- Transforming attributes

For example, from a twitter data stream, we might choose to extract the fields: author, timestamp, location, and then filter them based on the location of the author.

### Pattern 2: Alerts and Thresholds

This pattern detects a condition and generates alerts based on a condition. (e.g. Alarm on high temperature). These alerts can be based on a simple value or more complex conditions such as rate of increase etc.

For an example, in TFL (Transport for London) Demo video based on transit data from London, we trigger a speed alert when the bus has exceed a given speed limit.

![](https://www.youtube.com/watch?v=mjPPbTFAqes)

We can generate alerts for scenarios such as the server room temperature is continually increasing for last 5 mins.

### Pattern 3: Simple Counting and Counting with Windows

This pattern includes aggregate functions like Min, Max, Percentiles etc, and they can be counted without storing any data. (e.g. counting the number of failed transactions).

However, counts are often used with a time window attached to it. ( e.g. failure count last hour). There are many types of windows: sliding windows vs. batch (tumbling) windows and time vs. length windows. There are four main variations.

- Time, Sliding window: keeps each event for the given time window, produce an output whenever a new event has added or removed.
- Time, Batch window: also called tumbling windows, they only produce output at the end of the time window
- Length, Sliding: same as the time, sliding window, but keeps a window of n events instead of selecting them by time.
- Length, Batch window: same as the time, batch window, but keeps a window of n events instead of selecting them by time

There are special windows like decaying windows and unique windows. Please refer to [Stream Processing 101: From SQL to Streaming SQL in 10 Minutes](https://wso2.com/library/articles/2018/02/stream-processing-101-from-sql-to-streaming-sql-in-ten-minutes/) for more details.

### Pattern 4: Joining Event Streams

The main idea behind this pattern is to match up multiple data streams and create a new event steam. For an example, let’s assume we play a football game with both the players and the ball having sensors that emit events with current location and acceleration. We can use “joins” to detect when a player has kicked the ball. To that end, we can join the ball location stream and the player stream on the condition that they are close to each other by one meter and the ball’s acceleration has increased by more than 55m/s^2.

Among other use cases are combining data from two sensors, and detecting the proximity of two vehicles. Please refer to [Stream Processing 101: From SQL to Streaming SQL in 10 Minutes](https://wso2.com/library/articles/2018/02/stream-processing-101-from-sql-to-streaming-sql-in-ten-minutes/) for more details.

### Pattern 5: Data Correlation, Missing Events, and Erroneous Data

This pattern and the pattern four a has lot in common where here too we match up multiple streams. In addition, we also correlate the data within the same stream. This is because different data sensors can send events at different rates, and many use cases require this fundamental operator.

Following are some possible scenarios.

1. Matching up two data streams that send events at different speeds
2. Detecting a missing event in a data stream ( e.g. detect a customer request that has not been responded within 1 hour of its reception. )
3. Detecting erroneous data (e.g. Detect failed sensors using a set of sensors that monitor overlapping regions and using those redundant data to find erroneous sensors and removing their data from further processing)

### Pattern 6: Interacting with Databases

Often we need to combine the realtime data against the historical data stored in a disk. Following are few examples.

- When a transaction happened, look up the age using the customer ID from customer database to be used for Fraud detection (enrichment)
- Checking a transaction against blacklists and whitelists in the database
- Receive an input from the user (e.g. Daily discount amount may be updated in the database, and then the query will pick it automatically without human intervention.)

### Pattern 7: Detecting Temporal Event Sequence Patterns

Using regular expressions with strings, we detect a pattern of characters from a sequence of characters. Similarly, given a sequence of events, we can write a regular expression to detect a temporal sequence of events arranged on time where each event or condition about the event is parallel to a character in a string in the above example.

A frequently cited example, although bit simplistic, is that a thief, having stolen a credit card, would try a smaller transaction to make sure it works and then do a large transaction. Here the small transaction followed by a large transaction is a temporal sequence of events arranged on time and can be detected using a regular expression written on top of an event sequence.

Such temporal sequence patterns are very powerful. For example, the following video shows a real time analytics done using the data collected from a real football game. This was the dataset taken from DEBS 2013 Grand Challenge.

![](https://www.youtube.com/watch?v=nRI6buQ0NOM)

In the video, we used patterns on event sequence to detect the ball possession, the time period a specific player controlled the ball. A player possessed the ball from the time he hits the ball until someone else hits the ball. This condition can be written as a regular expression: a hit by me, followed by any number of hits by me, followed by a hit by someone else. (We already discussed how to detect the hits on the ball in Pattern 4: Joins).

Please refer to [Stream Processing 101: From SQL to Streaming SQL in 10 Minutes](https://wso2.com/library/articles/2018/02/stream-processing-101-from-sql-to-streaming-sql-in-ten-minutes/) for more details.

### Pattern 8: Tracking

The eighth pattern tracks something over space and time and detects given conditions. Following are few examples

- Tracking a fleet of vehicles, making sure that they adhere to speed limits, routes, and geo-fences.
- Tracking wildlife, making sure they are alive (they will not move if they are dead) and making sure they will not go out of the reservation.
- Tracking airline luggage and making sure they are not been sent to wrong destinations
- Tracking a logistic network and figure out bottlenecks and unexpected conditions.

For example, TFL Demo we discussed under pattern 2 shows an application that tracks and monitors London buses using the open data feeds exposed by TFL(Transport for London).

### Pattern 9: Detecting Trends

We often encounter time series data. Detecting patterns from time series data and bringing them into operator attention are common use cases.

Following are some of the examples of tends.

- Rise, Fall
- Turn (switch from a rise to a fall)
- Outliers
- Complex trends like triple bottom etc.

These trends are useful in a wide variety of use cases such as

- Stock markets and Algorithmic trading
- Enforcing SLA (Service Level Agreement), Auto Scaling, and Load Balancing
- Predictive maintenance ( e.g. guessing the Hard Disk will fill within next week)

### Pattern 10: Running the same Query in Batch and Realtime Pipelines

This pattern runs the same query in both Relatime and batch pipeline. It is often used to fill the gap left in the data due to batch processing. For example, if batch processing takes 15 minutes, results would lack the data for last 15 minutes.

The idea of this pattern, which is sometimes called “Lambda Architecture” is to use realtime analytics to fill the gap. Jay Kreps’s article “ [Questioning the Lambda Architecture](http://radar.oreilly.com/2014/07/questioning-the-lambda-architecture.html) ” discusses this pattern in detail.

### Pattern 11: Detecting and switching to Detailed Analysis

The main idea of the pattern is to detect a condition that suggests some anomaly, and further analyze it using historical data. This pattern is used with the use cases where we cannot analyze all the data with full detail. Instead, we analyze anomalous cases in full detail. Following are few examples.

- Use basic rules to detect Fraud (e.g. large transaction), then pull out all transactions done against that credit card for a larger time period (e.g. 3 months data) from a batch pipeline and run a detailed analysis
- While monitoring weather, detect conditions like high temperature or low pressure in a given region and then start a high resolution localized forecast on that region.
- Detect good customers, for example through the expenditure of more than $1000 within a month, and then run a detailed model to decide the potential of offering a deal.

### Pattern 12: Using a Model

The idea is to train a model (often a Machine Learning model), and then use it with the Realtime pipeline to make decisions. For example, you can build a model using R, export it as PMML (Predictive Model Markup Language) and use it within your realtime pipeline.

Among examples is Fraud Detections, Segmentation, Predict next value, Predict Churn. Also see InfoQ article, [Machine Learning Techniques for Predictive Maintenance](https://www.infoq.com/articles/machine-learning-techniques-predictive-maintenance), for a detailed example of this pattern.

### Pattern 13: Online Control

There are many use cases where we need to control something online. The classical use cases are the autopilot, self-driving, and robotics. These would involve problems like current situation awareness, predicting next value(s), and deciding on corrective actions.

You can implement most of these use cases with a Stream Processor that supports a Streaming SQL language. Please refer to [Stream Processing 101: From SQL to Streaming SQL in 10 Minutes](https://wso2.com/library/articles/2018/02/stream-processing-101-from-sql-to-streaming-sql-in-ten-minutes/) for a detailed discussion on Streaming SQL. You can try out above patterns with [WSO2 Stream Processor,](https://wso2.com/analytics) which is freely available under Apache Licence 2. You can also find other Stream Processors from [What are the best stream processing solutions out there?](https://www.quora.com/What-are-the-best-stream-processing-solutions-out-there)

This post is initially based on a tutorial in [DEBS 2015](http://www.debs2015.org/) (9th ACM International Conference on Distributed Event-Based Systems), describing a set of realtime analytics patterns. We have later edited the content to capture the trends such as [Streaming SQL](https://www.quora.com/What-is-a-Streaming-SQL-What-are-the-tools-supporting-Streaming-SQL).

You can find details about pattern implementations from the following slide deck, and source code from [https://github.com/suhothayan/DEBS-2015-Realtime-Analytics-Patterns](https://github.com/suhothayan/DEBS-2015-Realtime-Analytics-Patterns). Although Streaming SQL syntax closely follows the most recent release of WSO2 SP there are minor changes in the syntax. Please refer to WSO2 SP user guide for most recent syntax.

<iframe src="https://www.slideshare.net/slideshow/embed_code/49993642" allowfullscreen=""></iframe>

Hope this was useful. If you enjoyed this post you might also find following interesting.

- Stream Processing 101: From SQL to Streaming SQL in 10 Minutes, [https://wso2.com/library/articles/2018/02/stream-processing-101-from-sql-to-streaming-sql-in-ten-minutes/](https://wso2.com/library/articles/2018/02/stream-processing-101-from-sql-to-streaming-sql-in-ten-minutes/)
- Machine Learning Techniques for Predictive Maintenance, [https://www.infoq.com/articles/machine-learning-techniques-predictive-maintenance](https://www.infoq.com/articles/machine-learning-techniques-predictive-maintenance)