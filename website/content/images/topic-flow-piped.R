# load packages ----------------------------------------------------------------
library(DiagrammeR)

# build diagram ----------------------------------------------------------------
topic_flow <- create_graph() %>%
  # Exploring data ----
  add_node(label = "Exploring\ndata", 
           node_aes = node_aes(x = 2, y = 2,
                               shape = "square", fixedsize = TRUE, height = 1, 
                               fontname = "helvetica", fontsize = 12, fontcolor = "black",
                               color = "#364E4F", penwidth = 2, fillcolor = "#BCECED")) %>%
  add_node(label = "Visualize", 
           node_aes = node_aes(x = 2, y = 3, 
                               fontsize = 10, width = 0.75,
                               color = "#BCECED", penwidth = 2, fillcolor = "white")) %>%
  add_node(label = "Wrangle", 
           node_aes = node_aes(x = 3, y = 1, 
                               fontsize = 10, width = 0.75,
                               color = "#BCECED", penwidth = 2, fillcolor = "white")) %>%
  add_node(label = "Import", 
           node_aes = node_aes(x = 1, y = 1, 
                               fontsize = 10, width = 0.75,
                               color = "#BCECED", penwidth = 2, fillcolor = "white")) %>%
  add_edge(from = "Visualize", to = "Exploring\ndata", edge_aes = edge_aes(arrowhead = "none")) %>%
  add_edge(from = "Wrangle", to = "Exploring\ndata", edge_aes = edge_aes(arrowhead = "none")) %>%
  add_edge(from = "Import", to = "Exploring\ndata", edge_aes = edge_aes(arrowhead = "none")) %>%
  # Making rigorous conclusions ----
  add_node(label = "Making\nrigorous\nconclusions", 
           node_aes = node_aes(x = 5, y = 2,
                               shape = "square", fixedsize = TRUE, height = 1, 
                               fontsize = 12, fontcolor = "black",
                               color = "#5581B0", penwidth = 2, fillcolor = "#B6D7E4")) %>%
  add_edge(from = "Exploring\ndata", to = "Making\nrigorous\nconclusions",
           edge_aes = edge_aes(arrowhead = "normal")) %>%
  add_edge(from = "Making\nrigorous\nconclusions", to = "Exploring\ndata",
           edge_aes = edge_aes(arrowhead = "normal")) %>%
  add_node(label = "Model", 
           node_aes = node_aes(x = 4, y = 3, 
                               fontsize = 10, width = 0.75,
                               color = "#B6D7E4", penwidth = 2, fillcolor = "white")) %>%
  add_node(label = "Predict", 
           node_aes = node_aes(x = 6, y = 3, 
                               fontsize = 10, width = 0.75,
                               color = "#B6D7E4", penwidth = 2, fillcolor = "white")) %>%
  add_node(label = "Infer", 
           node_aes = node_aes(x = 5, y = 1, 
                               fontsize = 10, width = 0.75,
                               color = "#B6D7E4", penwidth = 2, fillcolor = "white")) %>%
  add_edge(from = "Model", to = "Making\nrigorous\nconclusions", edge_aes = edge_aes(arrowhead = "none")) %>%
  add_edge(from = "Predict", to = "Making\nrigorous\nconclusions", edge_aes = edge_aes(arrowhead = "none")) %>%
  add_edge(from = "Infer", to = "Making\nrigorous\nconclusions", edge_aes = edge_aes(arrowhead = "none")) %>%
  # Looking forward ----
  add_node(label = "Looking\nforward", 
           node_aes = node_aes(x = 8, y = 2,
                               shape = "square", fixedsize = TRUE, height = 1, 
                               fontname = "helvetica", fontsize = 12, fontcolor = "black",
                               color = "#737F7E", penwidth = 2, fillcolor = "#F9F9F9")) %>%
  add_edge(from = "Making\nrigorous\nconclusions", to = "Looking\nforward",
           edge_aes = edge_aes(arrowhead = "normal")) %>%
  add_edge(to = "Making\nrigorous\nconclusions", from = "Looking\nforward",
           edge_aes = edge_aes(arrowhead = "normal"))

render_graph(topic_flow)

# export using the viewer
