const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } = require('docx');
const fs = require('fs');

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 48, bold: true, color: "000000", font: "Arial" },
        paragraph: { spacing: { before: 240, after: 240 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, color: "2E74B5", font: "Arial" },
        paragraph: { spacing: { before: 300, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: "2E74B5", font: "Arial" },
        paragraph: { spacing: { before: 240, after: 100 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    properties: { page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    children: [
      // 标题
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("Attention Residuals 技术报告中文总结")] }),
      
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "来源: ", bold: true }),
        new TextRun("Kimi Team (Moonshot AI)")
      ]}),

      // 摘要
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("一、研究摘要")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun("本文提出了注意力残差连接（Attention Residuals, AttnRes），一种替代传统残差连接的新方法。传统残差连接以固定权重累加各层输出，导致隐藏状态随深度不受控增长，逐层稀释各层的贡献。AttnRes使用softmax注意力机制对前序层输出进行选择性聚合，允许每层以学习的、依赖输入的权重来聚合早期表示。")
      ]}),

      // 核心问题
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("二、核心问题")] }),
      new Paragraph({ spacing: { after: 100 }, children: [
        new TextRun({ text: "PreNorm稀释问题：", bold: true }),
        new TextRun("现代LLM普遍采用PreNorm架构配合残差连接，但这种固定单位权重的聚合方式存在以下问题：")
      ]}),
      new Paragraph({ spacing: { after: 100 }, indent: { left: 360 }, children: [
        new TextRun("1. 隐藏状态随深度不受控增长")
      ]}),
      new Paragraph({ spacing: { after: 100 }, indent: { left: 360 }, children: [
        new TextRun("2. 各层贡献被逐层稀释")
      ]}),
      new Paragraph({ spacing: { after: 200 }, indent: { left: 360 }, children: [
        new TextRun("3. 深层表示的主导性下降")
      ]}),

      // 解决方案
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("三、解决方案")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 完整注意力残差（Full AttnRes）")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun("将固定累加替换为对所有前序层输出的softmax注意力聚合，每层可学习地、依赖输入地选择聚合早期表示。这解决了稀释问题，但带来内存和通信开销。")
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.2 分块注意力残差（BlockAttnRes）")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun("将层划分为块，在块级表示上执行注意力，结合基于缓存的流水线通信和两阶段计算策略，大幅降低内存占用，同时保留大部分性能增益。")
      ]}),

      // 技术细节
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("四、技术细节")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 AttnResOp操作")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun("AttnResOp(α)操作用于聚合前序层输出：h_l = AttnResOp(α)(h_{l-1}, {h_0, ..., h_{l-2}})。通过注意力权重α实现内容相关的深度选择。")
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 计算优化")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun("采用缓存流水线减少通信开销，两阶段计算策略优化内存使用，使BlockAttnRes成为标准残差连接的实用替代方案。")
      ]}),

      // 实验结果
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("五、实验验证")] }),
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.1 扩展律实验")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun("扩展律实验确认了在不同模型规模下改进的一致性，验证了内容相关深度选择的有效性。")
      ]}),
      
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.2 大规模预训练")] }),
      new Paragraph({ spacing: { after: 100 }, children: [
        new TextRun("集成到Kimi Linear架构（48B总参数/3B激活参数），在1.4T tokens上预训练：")
      ]}),
      new Paragraph({ spacing: { after: 100 }, indent: { left: 360 }, children: [
        new TextRun("• 缓解PreNorm稀释问题")
      ]}),
      new Paragraph({ spacing: { after: 100 }, indent: { left: 360 }, children: [
        new TextRun("• 产生更均匀的输出幅度")
      ]}),
      new Paragraph({ spacing: { after: 100 }, indent: { left: 360 }, children: [
        new TextRun("• 更均匀的梯度分布")
      ]}),
      new Paragraph({ spacing: { after: 200 }, indent: { left: 360 }, children: [
        new TextRun("• 下游任务性能全面提升")
      ]}),

      // 主要贡献
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("六、主要贡献")] }),
      new Paragraph({ spacing: { after: 100 }, indent: { left: 360 }, children: [
        new TextRun("1. 提出AttnRes：用学习式注意力替代固定残差累加")
      ]}),
      new Paragraph({ spacing: { after: 100 }, indent: { left: 360 }, children: [
        new TextRun("2. 提出BlockAttnRes：高效变体，适合大规模训练")
      ]}),
      new Paragraph({ spacing: { after: 100 }, indent: { left: 360 }, children: [
        new TextRun("3. 设计缓存流水线和两阶段计算策略")
      ]}),
      new Paragraph({ spacing: { after: 200 }, indent: { left: 360 }, children: [
        new TextRun("4. 在48B MoE模型上验证有效性")
      ]}),

      // 结论
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("七、结论")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun("Attention Residuals为现代LLM架构提供了一种即插即用的残差连接替代方案。通过引入学习式的深度选择机制，AttnRes有效解决了PreNorm架构的稀释问题，在保持计算效率的同时提升了模型性能。该方法已在Kimi Linear大模型中成功验证，为未来LLM架构设计提供了新思路。")
      ]}),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/Users/javaedge/soft/VSProjects/claude-code-engineering/Attention_Residuals_中文总结.docx", buffer);
  console.log("文档已生成: Attention_Residuals_中文总结.docx");
});
