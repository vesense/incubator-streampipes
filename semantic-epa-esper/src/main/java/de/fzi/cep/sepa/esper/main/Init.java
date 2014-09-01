package de.fzi.cep.sepa.esper.main;

import java.util.ArrayList;
import java.util.List;

import de.fzi.cep.sepa.desc.ModelSubmitter;
import de.fzi.cep.sepa.desc.SemanticEventProcessingAgentDeclarer;
import de.fzi.cep.sepa.esper.config.EsperConfig;
import de.fzi.cep.sepa.esper.filter.text.TextFilterController;
import de.fzi.cep.sepa.esper.movement.MovementController;
import de.fzi.cep.sepa.esper.pattern.PatternController;

public class Init {

	public static void main(String[] args)
	{
		List<SemanticEventProcessingAgentDeclarer> declarers = new ArrayList<SemanticEventProcessingAgentDeclarer>();
		
		declarers.add(new MovementController());
		declarers.add(new TextFilterController());
		declarers.add(new PatternController());
		
		
		try {
			ModelSubmitter.submitAgent(declarers, EsperConfig.serverUrl, 8090);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
