"use client";

import { motion } from "framer-motion";

export type OrgNode = {
  id: string;
  title: string;
  name: string | null;
  parentId: string | null;
  order: number;
};

const OrgChartNode = ({ node, allNodes }: { node: OrgNode; allNodes: OrgNode[] }) => {
  const children = allNodes
    .filter((n) => n.parentId === node.id)
    .sort((a, b) => a.order - b.order);

  return (
    <li className="relative float-left text-center px-1 md:px-2 pt-6 transition-all duration-300">
      {/* Líneas conectoras superiores (dibujadas por CSS en el ul) */}
      <div className="inline-block">
        <div className="bg-gray-900 border-2 border-jv-turquoise rounded-xl p-3 md:p-4 shadow-[0_0_15px_rgba(28,201,183,0.2)] hover:shadow-[0_0_20px_rgba(155,28,201,0.5)] hover:border-jv-purple transition-all duration-300 relative z-10 w-32 md:w-48 text-center mx-auto">
          <h4 className="text-jv-turquoise font-bold text-xs md:text-sm">{node.title}</h4>
          {node.name && <p className="text-white text-xs md:text-sm mt-1 md:mt-2">{node.name}</p>}
        </div>
      </div>

      {children.length > 0 && (
        <ul className="pt-6 relative flex justify-center org-tree-ul">
          {children.map((child) => (
            <OrgChartNode key={child.id} node={child} allNodes={allNodes} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default function OrgChart({ nodes }: { nodes: OrgNode[] }) {
  const rootNodes = nodes.filter((n) => !n.parentId).sort((a, b) => a.order - b.order);

  return (
    <div className="w-full overflow-x-auto pb-10 custom-scrollbar flex justify-center">
      <style dangerouslySetInnerHTML={{__html: `
        .org-tree-ul {
          position: relative;
        }
        .org-tree-ul::before {
          content: '';
          position: absolute; top: 0; left: 50%;
          border-left: 2px solid #1cc9b7;
          width: 0; height: 1.5rem;
          transform: translateX(-50%);
        }
        .org-tree-ul li::before, .org-tree-ul li::after {
          content: '';
          position: absolute; top: 0; right: 50%;
          border-top: 2px solid #1cc9b7;
          width: 50%; height: 1.5rem;
        }
        .org-tree-ul li::after {
          right: auto; left: 50%;
          border-left: 2px solid #1cc9b7;
        }
        .org-tree-ul li:only-child::after, .org-tree-ul li:only-child::before {
          display: none;
        }
        .org-tree-ul li:only-child {
          padding-top: 0;
        }
        .org-tree-ul li:first-child::before, .org-tree-ul li:last-child::after {
          border: 0 none;
        }
        .org-tree-ul li:last-child::before {
          border-right: 2px solid #1cc9b7;
          border-radius: 0 5px 0 0;
        }
        .org-tree-ul li:first-child::after {
          border-radius: 5px 0 0 0;
        }
      `}} />
      <ul className="flex justify-center">
        {rootNodes.map((root) => (
          <OrgChartNode key={root.id} node={root} allNodes={nodes} />
        ))}
      </ul>
    </div>
  );
}
