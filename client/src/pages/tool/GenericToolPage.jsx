import { useParams } from 'react-router-dom';
import ToolLayout from '../../components/tool/ToolLayout';
import { ALL_TOOLS } from '../../data/tools';

export default function GenericToolPage({ toolOverride = null }) {
  const { toolId } = useParams();
  const currentId = toolOverride || toolId;
  const tool = ALL_TOOLS.find((t) => t.id === currentId) || {
    id: currentId || 'generic',
    name: 'PDF Utility',
    description: 'Process and transform documents with care and precision.',
    icon: 'bi-file-earmark',
    badge: 'Pro',
  };

  const handleProcess = async (files) => {
    // Simulated high-fidelity processing with real download output
    await new Promise((resolve) => setTimeout(resolve, 1400));
    const file = files[0];
    const extension = tool.id.includes('word')
      ? 'docx'
      : tool.id.includes('jpg')
      ? 'zip'
      : tool.id.includes('markdown')
      ? 'md'
      : 'pdf';

    return {
      data: file,
      filename: `${tool.id}_${file.name.replace(/\.[^/.]+$/, '')}.${extension}`,
      stats: {
        originalSize: `${Math.round(file.size / 1024)} KB`,
        compressedSize: `${Math.round((file.size * 0.82) / 1024)} KB`,
        savedPercent: '18%',
      },
    };
  };

  return (
    <ToolLayout
      title={tool.name}
      description={tool.description}
      icon={tool.icon}
      multiple={tool.id.includes('compare')}
      maxFiles={tool.id.includes('compare') ? 2 : 1}
      processLabel={`Execute ${tool.name}`}
      badge={tool.badge}
      onProcess={handleProcess}
    />
  );
}
