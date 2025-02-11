export const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  export const exportToPDF = async (messages) => {
    const content = messages.map(msg => ({
      type: msg.type,
      content: msg.content,
      sources: msg.sources || [],
      timestamp: formatDate(new Date())
    }));
    
    // Format as readable text
    const text = content.map(msg => (
      `${msg.type.toUpperCase()} (${msg.timestamp}):\n${msg.content}\n\n` +
      (msg.sources.length ? 'Sources:\n' + msg.sources.map(source => 
        `- ${source.source}: ${source.translation || source.text}`
      ).join('\n') : '') + '\n\n'
    )).join('\n');
  
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asksunna-conversation-${formatDate(new Date())}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };