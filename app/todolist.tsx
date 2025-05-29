import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../lib/supabase";
import BottomTab from "./components/BottomTab";

interface Todo {
  id: string;
  text: string;
  module: string;
  completed: boolean;
  created_at: string;
}

// Custom hook for managing todos and Supabase interactions
function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch todos from Supabase
  const fetchTodos = async () => {
    try {
      if (!refreshing && todos.length === 0) setLoading(true);

      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const currentIds = todos.map((t) => t.id).join(",");
        const incomingIds = data.map((t) => t.id).join(",");
        if (currentIds !== incomingIds) {
          setTodos(data);
        }
      }
    } catch (error) {
      Alert.alert("Error", (error as Error).message || "Failed to fetch todos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Subscribe to realtime changes in Supabase
  const subscribeToRealtime = () => {
    return supabase
      .channel("todos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "todos" },
        (payload) => {
          const newTodo = payload.new as Todo;
          const oldTodo = payload.old as Todo;

          setTodos((prevTodos) => {
            switch (payload.eventType) {
              case "INSERT":
                if (prevTodos.some((t) => t.id === newTodo.id)) return prevTodos;
                return [newTodo, ...prevTodos];

              case "UPDATE":
                return prevTodos.map((t) => (t.id === newTodo.id ? newTodo : t));

              case "DELETE":
                return prevTodos.filter((t) => t.id !== oldTodo.id);

              default:
                return prevTodos;
            }
          });
        }
      )
      .subscribe();
  };

  // Add a new todo
  const addTodo = async (newTodoText: string, setNewTodo: React.Dispatch<React.SetStateAction<string>>) => {
    const trimmed = newTodoText.trim();
    if (!trimmed) return;
    try {
      const { data, error } = await supabase
        .from("todos")
        .insert([{ text: trimmed, completed: false, module: "General" }])
        .select();
      if (error) throw error;
      if (data && data[0]) {
        setTodos((prev) => [data[0], ...prev]);
      }
      setNewTodo("");
    } catch (error) {
      Alert.alert("Error", (error as Error).message || "Failed to add todo");
    }
  };

  // Toggle completed status of a todo
  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    try {
      const { data, error } = await supabase
        .from("todos")
        .update({ completed: !todo.completed })
        .eq("id", id)
        .select();
      if (error) throw error;
      if (data && data[0]) {
        setTodos((prev) => prev.map((t) => (t.id === id ? data[0] : t)));
      }
    } catch (error) {
      Alert.alert("Error", (error as Error).message || "Failed to update todo");
    }
  };

  // Delete a todo
  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) throw error;
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      Alert.alert("Error", (error as Error).message || "Failed to delete todo");
    }
  };

  return {
    todos,
    loading,
    refreshing,
    setRefreshing,
    fetchTodos,
    subscribeToRealtime,
    addTodo,
    toggleTodo,
    deleteTodo,
  };
}

export default function TodoListScreen() {
  const [newTodo, setNewTodo] = useState("");

  // Use custom hook for todo logic
  const {
    todos,
    loading,
    refreshing,
    setRefreshing,
    fetchTodos,
    subscribeToRealtime,
    addTodo,
    toggleTodo,
    deleteTodo,
  } = useTodos();

  useFocusEffect(
    useCallback(() => {
      fetchTodos();
      const channel = subscribeToRealtime();
      return () => {
        channel.unsubscribe();
      };
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchTodos();
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#003049" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>To-Do List</Text>
        <TouchableOpacity style={styles.bellIcon}>
          <Ionicons name="notifications" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Input for task with + button */}
      <AddTodoInput newTodo={newTodo} setNewTodo={setNewTodo} addTodo={() => addTodo(newTodo, setNewTodo)} />

      {/* Stats and Clear Completed */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Total: {todos.length}</Text>
        <TouchableOpacity
          onPress={() => {
            const completedIds = todos.filter((t) => t.completed).map((t) => t.id);
            Promise.all(
              completedIds.map((id) =>
                supabase.from("todos").delete().eq("id", id)
              )
            )
              .then(() => {
                // Update state after deletion
                deleteCompletedTodos();
              })
              .catch((error) => {
                Alert.alert("Error", (error as Error).message || "Failed to clear completed todos");
              });
          }}
        >
          <Text style={styles.clearText}>Clear Completed</Text>
        </TouchableOpacity>
      </View>
      {/* Todo List */}
      <TodoList
        todos={todos}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
      <View style={styles.bottomNav}>
        <BottomTab icon="home" label="Home" />
        <BottomTab icon="calendar" label="Timetable" />
        <BottomTab icon="leaf" label="Rewards" />
        <BottomTab icon="user" label="Profile" />
      </View>
    </SafeAreaView>
  );

  // Helper to remove completed todos from state after deletion
  function deleteCompletedTodos() {
    // Filter out completed todos
    const filteredTodos = todos.filter((t) => !t.completed);
    // Update state
    // Using setTodos from useTodos is not directly accessible here,
    // so we can update by refetching or by setting state here if exposed.
    // For simplicity, refetch todos
    fetchTodos();
  }
}

// Components

const AddTodoInput = React.memo(function AddTodoInput({
  newTodo,
  setNewTodo,
  addTodo,
}: {
  newTodo: string;
  setNewTodo: (t: string) => void;
  addTodo: () => void;
}) {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Add a new task..."
        value={newTodo}
        onChangeText={setNewTodo}
        onSubmitEditing={addTodo}
        returnKeyType="done"
      />
      <TouchableOpacity
        style={[styles.addButton, !newTodo.trim() && styles.addButtonDisabled]}
        onPress={addTodo}
        disabled={!newTodo.trim()}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
});

const TodoItem = React.memo(({
  item,
  toggleTodo,
  deleteTodo,
}: {
  item: Todo;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}) => (
  <View style={styles.todoItem}>
    <Checkbox
      value={item.completed}
      onValueChange={() => toggleTodo(item.id)}
      color={item.completed ? "#003049" : undefined}
      style={styles.checkbox}
    />
    <View style={styles.todoTextContainer}>
      <Text style={[styles.todoText, item.completed && styles.completedText]} numberOfLines={2}>
        {item.text}
      </Text>
      <Text style={styles.moduleText}>{item.module || "General"}</Text>
    </View>
    <TouchableOpacity onPress={() => deleteTodo(item.id)} style={styles.deleteButton}>
      <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
    </TouchableOpacity>
  </View>
));

const TodoList = React.memo(({
  todos,
  toggleTodo,
  deleteTodo,
  refreshing,
  onRefresh,
}: {
  todos: Todo[];
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  refreshing: boolean;
  onRefresh: () => void;
}) => (
  <FlatList
    data={todos}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <TodoItem item={item} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
    )}
    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#003049"]} />}
    ListEmptyComponent={
      <View style={styles.emptyState}>
        <Ionicons name="checkmark-done" size={40} color="#ccc" />
        <Text style={styles.emptyText}>No tasks yet</Text>
      </View>
    }
  />
));

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7", paddingHorizontal: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#003049", marginLeft: 15},
  bellIcon: { backgroundColor: "#003049", padding: 10, borderRadius: 20, marginRight: 10},
  inputContainer: { flexDirection: "row", marginBottom: 20},
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#003049",
    borderRadius: 10,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    opacity: 1,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  checkbox: {
    marginRight: 15,
    width: 22,
    height: 22,
  },
  todoTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  todoText: {
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  moduleText: {
    fontSize: 12,
    color: "#003049",
    marginTop: 3,
  },
  deleteButton: {
    padding: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  statsText: {
    color: "#000",
    fontSize: 14,
  },
  clearText: {
    color: "#ff6b6b",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    color: "#888",
    marginTop: 10,
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#003049",
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});