---
title: "AI Architects: The New Programmers"
source: "https://towardsdatascience.com/ai-architects-the-new-programmers-7ed1963d6166/"
author:
  - "[[Nariman Mammadli]]"
published: 2021-09-20
created: 2026-04-29
description: "On the nature of the novel paradigm of programming"
tags:
  - "clippings"
---
![Image by Ahmad Ardity from Pixabay](https://towardsdatascience.com/wp-content/uploads/2021/09/1TcMi9WbZHoOnOEh9xhoUew.jpeg)

Image by Ahmad Ardity from Pixabay

> Artifical Intelligence success stories have become so ubiquitous that it seems that every piece of software will soon incorporate AI in one way or another. But what does an AI program do? AI programs can learn and adapt with experience. The difference in building AI programs from building non-AI ones is bringing about a paradigm shift in our understanding of what programming is. In this article, I explore the essentials of the new paradigm and possible future routes it can take.
> 
> Karpathy, in his article " [Software 2.0](https://karpathy.medium.com/software-2-0-a64152b37c35) ", describes an AI-triggered paradigm shift. He imagines the "Programmer 2.0" as more involved with ‘editing and growing datasets’ than writing code, and he predicts a decline in demand for human developers. AI, he says, will find the right algorithm itself, given the right dataset. I argue otherwise. I believe that Software 2.0 will be less about data, but *more* about defining the proper constraints around the search space of possible algorithms. I argue that the demand for human developers will not weaken, but instead, its nature will change.

### Divergence of Paradigms

An algorithm is a finite sequence of machine-interpretable instructions. In the old paradigm, the programmer’s goal was to knit together a sequence of instructions that constitute a single, well-defined algorithm. In the new paradigm, the programmer only specifies a template, which encodes multiple potential algorithms, and the machine learns the optimal algorithms using training data. The template maps to some region in the whole algorithmic space – the space of all possible algorithms.

### The Taxonomy of Algorithmic Templates

[Turing Machine](https://en.wikipedia.org/wiki/Turing_machine) (TM) is a universal template. It encodes in itself the space of all possible algorithms. What follows is that every conceivable algorithm is, in essence, a Turing Machine (TM) with a table of rules. The table of rules dictates the precise pathway of execution. A special Turing Machine called the [Universal Turing Machine](https://en.wikipedia.org/wiki/Universal_Turing_machine) (UTM) can simulate the execution of any other Turing Machine, given a table of rules as an input.

\[Lambda Calculus\]([https://en.wikipedia.org/wiki/Lambda\_calculus#:~:text=Lambda%20calculus%20(also%20written%20as,to%20simulate%20any%20Turing%20machine](https://en.wikipedia.org/wiki/Lambda_calculus#:~:text=Lambda%20calculus%20\(also%20written%20as,to%20simulate%20any%20Turing%20machine).) (LC), developed by Alonso Church – Alan Turing’s supervisor – is another universal template, equivalent to the Turing Machine. The aesthetics of LC differ considerably from that of TM. TM formalizes computing as manipulation of symbols on a strip of tape according to a table of rules. LC formalizes it as the stacking of functions and their resolution via variable binding and substitution. Put another way, TM is a visual representation of computing, whereas LC is abstract, algebraic in style (see Figures 1,2).

![Figure 1. A Turing machine. By Gabriel F - Own work, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=26270095](https://towardsdatascience.com/wp-content/uploads/2021/09/1VS_rypBWCAgE9Yshs59wUg.jpeg)

Figure 1. A Turing machine. By Gabriel F – Own work, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=26270095

Figure 2. A Lambda expression for the universal Lambda interpreter. It is the equivalent of UTM in Lambda Calculus. Taken from crypto.stanford.edu/~blynn/lambda/.

Both TM and LC span the whole algorithmic space. The question now is how to construct templates that span only subspaces and do machine learning on them. An artificial neural network (ANN), using its adjustable weights, can encode and simulate multiple algorithms. ANNs do not span the whole algorithmic space, except the ones that are Turing-complete \[1\]. Therefore, they let us create a variety of templates via custom architectures. Unlike TM and LC, an ANN-encoded algorithmic space is continuous, enabling [differential programming](https://en.wikipedia.org/wiki/Differentiable_programming), thereby more accessible machine learning. It has its limitations, too, which I touch upon later.

Algorithmic sub-spaces or templates can be organized in a tree-like structure, as shown in Figure 3. The root of the tree is a universal template, whether it is TM, LC, or a Turing-complete neural network. As we move towards the bottom, templates become more specific as they contain smaller and smaller families of algorithms. The leaf nodes correspond to individual algorithms.

![Figure 3. The tree of algorithms. The leaves correspond to specific algorithms, whereas non-leaf nodes correspond to families of algorithms. A family of algorithms can be simulated by some specific algorithm sitting at the bottom. UTM can simulate any algorithm. Note that the tree is purely hypothetical.](https://towardsdatascience.com/wp-content/uploads/2021/09/1OyAxTUUGplZsayRwtaipHA.png)

Figure 3. The tree of algorithms. The leaves correspond to specific algorithms, whereas non-leaf nodes correspond to families of algorithms. A family of algorithms can be simulated by some specific algorithm sitting at the bottom. UTM can simulate any algorithm. Note that the tree is purely hypothetical.

It is important to note that there are infinitely many ways of constructing such a tree, although some of them could be in more accordance with our prior knowledge about the world.

### Divergence of Styles

What strategy does the programmer of Software 2.0 need to follow in constructing templates? In light of big data and relatively cheap compute, a tempting approach would be to start with a generic template or a large search space and let the machine search for the optimal algorithms. Total algorithmic space is infinitely large compared to the small region containing the working algorithms, so learning with generic templates requires a lot of data and computing. For example, [GPT-3](https://en.wikipedia.org/wiki/GPT-3), a language model that produces human-like text, uses 175 billion parameters, 45 terabytes of training data. In principle, such a data-heavy approach does not require much human expertise.

An alternative approach is to start with a small search space or a highly specialized template. Here, human expertise is necessary to shrink the search space properly before passing the ball to the machine. If done well, learning in smaller search spaces becomes less costly, and solutions found are more likely to align with what we intuit to be intelligent. A good example is a convolutional neural network ([CNN](https://en.wikipedia.org/wiki/Convolutional_neural_network)). The idea of CNN was inspired by neuroscience research done on the visual cortex of the brain \[2\]. CNNs use the principle of [locality](https://en.wikipedia.org/wiki/Principle_of_locality) and t [ranslational invariance](https://en.wikipedia.org/wiki/Translational_symmetry), resulting in shared weights, thereby a smaller number of free parameters than would normally be required. AlexNet \[3\], one of the most influential computer vision models that use CNNs, requires around 150G of training data and 61 million parameters. I argue that this approach will play a more prominent role in the future of AI. In support of this approach to AI, I will explore how it is used by nature itself to solve the problem of intelligence and learning.

### The Nature of Natural Intelligence

Animals and humans do not need as much data to learn as modern AI does. On the contrary, young animals, including humans, learn rapidly with minimal interaction with their environment. Zador \[4\] argues that it is because animals are born with highly structured brains. A highly structured brain shrinks the search space of possible algorithms and enables fast and rapid learning. In light of Figure 3 above, it means that natural brains encode templates that are not generic; on the contrary, they are highly specialized.

Zador also introduces the concept of a "genomic bottleneck". The genomic bottleneck suggests that the wiring diagram of the brain is too complex to be explicitly specified in the genome, hinting at some compression taking place at the genome level. At this point, an interesting question arises: how did nature select for highly specialized brain structures while preserving the compressibility? The answer to this question will reveal interesting clues for Software 2.0.

### The Nature of Nature

Lin et al. \[5\] have inadvertently answered this question. They showed that physics equations describing the universe require surprisingly fewer parameters to define than expected. They argue that because the universe follows the principles of symmetry, [compositionality](https://en.wikipedia.org/wiki/Principle_of_compositionality), [locality](https://en.wikipedia.org/wiki/Principle_of_locality#:~:text=In%20physics%2C%20the%20principle%20of,%22action%20at%20a%20distance%22.), and hierarchical form, so will equations that try to model its laws. It follows that algorithms optimal for navigation in the universe also follow the same principles, which also explains the success of deep and cheap learning in tasks such as image recognition.

In their attempt to explain the success of deep learning, the authors also answered the question about the genomic bottleneck. Nature may preserve compressibility by choosing brain structures that follow the principles above. In other words, the specialization of brain structures did not happen in random directions but followed these high-level principles.

I predict that architects of Software 2.0 will make use of these guiding principles in building optimal algorithmic templates. Interestingly, convolutional neural networks, inspired by neuroscience, also make use of translational symmetry and locality. Note that these principles only dictate the form of the final solution. To fill in the proper content, we need to gather more knowledge and translate it into the specifics of Software 2.0

### The Birth of Language

The translation of knowledge into algorithmic templates is challenging in the case of deep learning with ANNs. We are more accustomed to acquire, manipulate, and communicate knowledge using symbolic languages. Therefore, it is more intuitive for us to translate knowledge into classic computer science concepts, which are [discrete](https://en.wikipedia.org/wiki/Discrete_mathematics) and symbolic. On the other hand, modern deep learning operates in the continuous domain, which is more suited for machine learning due to its differentiability and less suitable for humans to reason about its workings. Therefore, the gap between classic computer science and modern deep learning is a challenge to be tackled \[6\]. I believe that Lambda calculus, or functional programming, will play a key role in narrowing the gap (as Chris Olah [argues](https://colah.github.io/posts/2015-09-NN-Types-FP/)).

### Conclusion

AI has initiated a paradigm shift in our understanding of programming. I argued in this article that the art of the new paradigm is not about editing and growing large datasets but about designing optimal algorithmic \*\*\*\* templates that facilitate fast and effective machine learning with minimal demand for training data. Nature hints towards the possible routes to achieve this goal, but more work is needed to unlock the symbolic power of neural networks.

### References

1. Siegelmann, H. T., & Sontag, E. D. (1992). On the computational power of neural nets. *Proceedings of the Fifth Annual Workshop on Computational Learning Theory – COLT* ’92. [https://doi.org/10.1145/130385.130432](https://doi.org/10.1145/130385.130432)
2. Hubel, D. H.; Wiesel, T. N. (1968–03–01). ["Receptive fields and functional architecture of monkey striate cortex"](https://www.ncbi.nlm.nih.gov/pmc/articles/[PMC]\(https://en.wikipedia.org/wiki/PMC_\(identifier\)) [1557912](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1557912)). *The Journal of Physiology*. **195** (1): 215–243. [doi](https://en.wikipedia.org/wiki/Doi_\(identifier\)):[10.1113/jphysiol.1968.sp008455](https://doi.org/10.1113%2Fjphysiol.1968.sp008455). [ISSN](https://en.wikipedia.org/wiki/ISSN_\(identifier\)) [0022–3751](https://www.worldcat.org/issn/0022-3751). PMC 1557912. [PMID](https://en.wikipedia.org/wiki/PMID_\(identifier\)) [4966457](https://pubmed.ncbi.nlm.nih.gov/4966457).
3. Krizhevsky, Alex; Sutskever, Ilya; Hinton, Geoffrey E. (2017–05–24). ["ImageNet classification with deep convolutional neural networks"](https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks.pdf) (PDF). *Communications of the ACM*. **60** (6): 84–90. [doi](https://en.wikipedia.org/wiki/Doi_\(identifier\)):[10.1145/3065386](https://doi.org/10.1145%2F3065386). [ISSN](https://en.wikipedia.org/wiki/ISSN_\(identifier\)) [0001–0782](https://www.worldcat.org/issn/0001-0782). [S2CID](https://en.wikipedia.org/wiki/S2CID_\(identifier\)) [195908774](https://api.semanticscholar.org/CorpusID:195908774).
4. Zador, A.M. A critique of pure learning and what artificial neural networks can learn from animal brains. *Nat Commun* **10,** 3770 (2019). [https://doi.org/10.1038/s41467-019-11786-6](https://doi.org/10.1038/s41467-019-11786-6)
5. Lin, H. W., Tegmark, M., & Rolnick, D. (2017). Why does deep and cheap learning work so well? *Journal of Statistical Physics*, *168* (6), 1223–1247. [https://doi.org/10.1007/s10955-017-1836-5](https://doi.org/10.1007/s10955-017-1836-5)
6. Veličković, P., & Blundell, C. (2021). Neural algorithmic reasoning. *Patterns*, *2* (7), 100273. [https://doi.org/10.1016/j.patter.2021.100273](https://doi.org/10.1016/j.patter.2021.100273)